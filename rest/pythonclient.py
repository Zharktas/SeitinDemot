from urllib2 import Request
import urllib2
import base64

def addAuth(req):
  username = 'antti'
  password = '1234'
  base64string = base64.encodestring('%s:%s' % (username, password))[:-1]
  header =  "Basic %s" % base64string
  req.add_header("Authorization", header)
  req.add_header("Content-Type", "application/json")

def open(req):
  try:
    sock = urllib2.urlopen(req)
    content = sock.read() 
    sock.close()
    print content
  except urllib2.HTTPError, e:
    print('HTTPError = ' + str(e.code))
  except urllib2.URLError, e:
    print('URLError = ' + str(e.reason))
  except Exception:
    import traceback
    print('generic exception: ' + traceback.format_exc())

baseurl = 'http://localhost:3000/api/heroes'

req = Request(baseurl)
addAuth(req)
data='{"heroid": "fantastic", "name": "Mister Fantastic"}'
req.add_data(data)
req.get_method = lambda: 'POST'
open(req)

req = Request(baseurl+'/shehulk')
addAuth(req)
data='{"heroid":"shehulk", "name": "She-Hulk" }'
req.add_data(data)
req.get_method = lambda: 'PUT'
open(req)

req = Request(baseurl+'/fantastic')
addAuth(req)
req.get_method = lambda: 'DELETE'
open(req)

req = Request(baseurl)
addAuth(req)
req.get_method = lambda: 'GET'
open(req)

