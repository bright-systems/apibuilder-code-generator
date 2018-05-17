const fs = require('fs')
const apiBuilderHelpers = require('./lib/apiBuilderHelpers')
const arrayHelpers = require('./lib/arrayHelpers')
const dataTypes = require('./lib/dataTypes')
const Handlebars = require('handlebars')
const path = require('path')
const postgresHelpers = require('./lib/postgresHelpers')
const nameHelpers = require('./lib/nameHelpers')
const stringHelpers = require('./lib/stringHelpers')
const url = require('url')

const configFilename = '.config'
const generatorsRootDir = path.join(__dirname, 'generators')

registerAll([apiBuilderHelpers, arrayHelpers, dataTypes, nameHelpers, postgresHelpers, stringHelpers])

exports.generatorsHandler = function(event, context, callback) {
  try {
    const key = event.pathParameters ? event.pathParameters.key : null
    const isSingle = (key !== null && key !== undefined)
    const generatorNames = fs.readdirSync(generatorsRootDir).filter(function(fileName) {
      return fs.lstatSync(path.join(generatorsRootDir, fileName)).isDirectory() && (!isSingle || fileName.toLowerCase() === key.toLowerCase())
    })
    const generators = generatorNames.map(function(name) {
      const config = fs.readFileSync(path.join(generatorsRootDir, name, configFilename)).toString()
      const configJson = config === '' ? {} : JSON.parse(config)
      return {
        key: name,
        name: configJson.name,
        language: configJson.language,
        description: configJson.description,
        attributes: configJson.attributes || []
      }
    })
    if (generators.length === 0 && isSingle) {
      callback(null, { statusCode: 404 })
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify(generators) })
    }
  } catch (e) {
    console.error(e)
    callback(e)
  }
}

exports.healthCheckHandler = function(event, context, callback) {
  callback(null, { statusCode: 200, body: JSON.stringify({ status: 'healthy' }) })
}

exports.invocationsHandler = function(event, context, callback) {
  try {
    const body = JSON.parse(event.body)
    const service = body.service
    const generatorDir = path.join(generatorsRootDir, event.pathParameters.key)

    if (fs.existsSync(generatorDir)) {
      const config = JSON.parse(fs.readFileSync(path.join(generatorDir, configFilename)).toString())
      callback(null, { statusCode: 200, body: JSON.stringify({ files: flatten(getFile(config, service, generatorDir)), source: '' }) })
    } else {
      callback(null, { statusCode: 404 })
    }
  } catch (e) {
    console.error(e)
    callback(e)
  }
}

function flatten(arr, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i]
    if (Array.isArray(value)) {
      flatten(value, result)
    } else {
      result.push(value)
    }
  }
  return result
}

function getBodyIndex(parameters) {
  return parameters.indexOf(function(parameter) { return parameter.location === 'Body' })
}

function getDescendantObject(obj, path) {
  var arr = path.split('.')
  while (arr.length) {
    obj = obj[arr.shift()]
  }
  return obj
}

function getFile(config, service, rootPath, subPath = '', fileName = '') {
  const filePath = path.join(rootPath, subPath, fileName)
  if (fs.lstatSync(filePath).isDirectory()) {
    return fs.readdirSync(filePath).map(function(subFileName) {
      return getFile(config, service, rootPath, path.join(subPath, fileName), subFileName)
    })
  } else if (fileName.toLowerCase() === configFilename) {
    return []
  } else {
    const content = fs.readFileSync(path.join(filePath)).toString()
    const pathStr = path.join(subPath, fileName)
    const match = pathStr.match(/\{\{\s*#each\s+(.+)\}\}(.+)\{\{:each\}\}/i)
    if (match) {
      const pathSubTemplate = Handlebars.compile(match[2])
      const subContext = getDescendantObject(service, match[1])
      return subContext.map(function(childContext, index) {
        const contentTemplate = Handlebars.compile(content)
        const pathTemplate = Handlebars.compile(pathStr.replace(match[0], pathSubTemplate(childContext)))
        childContext['_root_'] = service
        return toFile(config, pathTemplate(service), contentTemplate(childContext))
      })
    } else {
      const contentTemplate = Handlebars.compile(content)
      const pathTemplate = Handlebars.compile(pathStr)
      return toFile(config, pathTemplate(service), contentTemplate(service))
    }
  }
}

function getFileFlags(config, filePath) {
  return Object.keys(config.file_flags).filter(function(fileFlag) {
    return config.file_flags[fileFlag].findIndex(function(pattern) { return filePath.match(pattern) }) >= 0
  })
}

function hasBody(parameters) {
  return getBodyIndex(parameters) >= 0
}

function toFile(config, filePath, contents) {
  var parsedPath = path.parse(filePath)
  return {
    name: parsedPath.base,
    dir: parsedPath.dir,
    contents: contents,
    flags: getFileFlags(config, filePath)
  }
}

Handlebars.registerHelper('getRequestModel', function(parameters, modelName, method) {
  const bodyIndex = getBodyIndex(parameters)
  if (bodyIndex >= 0 && parameters.length === 1) {
    return nameHelpers.toClassName(parameters[0].type)
  } else if (parameters.length === 0) {
    return 'Empty'
  } else {
    return nameHelpers.toClassName(modelName + ' ' + method + ' request')
  }
})

Handlebars.registerHelper('ifEmpty', function(parameters, opts) {
  if (
    (Array.isArray(parameters) && parameters.length === 0) ||
    (typeof parameters === 'object' && Object.keys(parameters).length === 0) ||
    !parameters
  ) { return opts.fn(this) } else { return opts.inverse(this) }
})

Handlebars.registerHelper('ifEq', function(a, b, opts) {
  if (a === b) { return opts.fn(this) } else { return opts.inverse(this) }
})

Handlebars.registerHelper('ifNEq', function(a, b, opts) {
  if (a !== b) { return opts.fn(this) } else { return opts.inverse(this) }
})

Handlebars.registerHelper('ifHasBody', function(parameters, opts) {
  if (hasBody(parameters)) { return opts.fn(this) } else { return opts.inverse(this) }
})

Handlebars.registerHelper('ifReservedWord', function(word, language, opts) {
  const reservedWords = {
    'postgres': [
      'create',
      'drop',
      'index',
      'table',
      'trigger'
    ],
    'scala': [
      'type'
    ]
  }
  const languageList = reservedWords[language.toLowerCase()] || []
  if (languageList.includes(word)) { return opts.fn(this) } else { return opts.inverse(this) }
})

Handlebars.registerHelper('namespaceToPath', function(namespace) {
  return path.join(...namespace.split('.'))
})

Handlebars.registerHelper('urlPath', function(urlStr) {
  const path = url.parse(urlStr).pathname
  return path === '/' ? '' : path
})

function registerAll(libs) {
  if (!Array.isArray(libs)) libs = [libs]
  libs.forEach(lib => Object.keys(lib).forEach(k => Handlebars.registerHelper(k, lib[k])))
}
