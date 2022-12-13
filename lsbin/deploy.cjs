// made by larsson 2022-10-16

// -- input parm -- //

var arguments = process.argv.splice(2)
if (!arguments || arguments.length != 1) {
  console.error("image name error.")
  return
}

// -- setup -- //

const imageName = arguments[0] // 'repo.jzdianzi.cn/larsson-www:1.0-SNAPSHOT'
const dockerServerHost = '192.168.0.20'
const dockerServerPort = 2375
const dockerApiPushUrl = '/images/' + imageName + '/push'
const repoAuth = 'ewogICJ1c2VybmFtZSI6ICJhZG1pbiIsCiAgInBhc3N3b3JkIjogIm5leHVzQDEwMDUiLAogICJlbWFpbCI6ICI3NzU0MDk3NUBxcS5jb20iLAogICJzZXJ2ZXJhZGRyZXNzIjogInJlcG8uanpkaWFuemkuY24iCn0='


// -- do -- //

const Docker = require('node-docker-api').Docker,
  tar = require('tar-fs')

const promisifyStream = (stream) => new Promise((resolve, reject) => {
  stream.on('data', (d) => console.log(d.toString()))
  stream.on('end', resolve)
  stream.on('error', reject)
})

var docker = new Docker({ host: dockerServerHost, port: dockerServerPort });

// create image by Dockerfile
var tarStream = tar.pack('./dist')
docker.image.build(tarStream, {
  t: imageName
})
  .then((stream) => promisifyStream(stream))
  .then(() => docker.image.get(imageName).status())
  .then(() => {
    post(dockerApiPushUrl,
      repoAuth, function (json) {
        console.log(json)

        // push image to repo
        docker.image.get(imageName).remove().then(console.log('done, image pushed to repo and temp image removed from docker host server.'))
      })
  })
  .catch((error) => console.log(error))

// -- post helper -- //

const http = require('http')
function post(action, auth, callback) {
  var options = {
    hostname: dockerServerHost,
    port: dockerServerPort,
    path: action,
    method: 'POST',
    headers: {
      'X-Registry-Auth': auth
    }
  };
  var req = http.request(options, function (res) {
    var body = ""
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      body += chunk
    });
    res.on('end', function () {
      try {
        var json = JSON(body);
      }
      catch
      {
        json = body
      }
      callback(json)
    });
  });
  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  });
  // req.write(send)
  req.end()
}