const request = require('request-promise');
const xmlbuilder = require('xmlbuilder');

const SIS_BASE_URL = 'https://smile-dev.epcat.de';
const SIS_EVENT_URL = `${ SIS_BASE_URL }/api/capture/`;
const SIS_USERNAME = 'smileprojectbp@gmail.com';
const SIS_PASSWORD = 'you\'re the ; to my statements1';

const getCurrentTimeAsIsoString = () => {
  const currentDate = new Date();
  return currentDate.toISOString();
};

const wrapObjectEvent = function (objectEvent) {
  return {
    'epcis:EPCISDocument': {
      '@xmlns:epcis': 'urn:epcglobal:epcis:xsd:1',
      '@xmlns:epcglobal': 'urn:epcglobal:xsd:1',
      '@xmlns:smile': 'http://ns.smile-project.de/epcis',
      '@schemaVersion': '1.2',
      '@creationDate': '2018-05-15T14:07:44.834Z',
      'EPCISBody': {
        'EventList': {
          'ObjectEvent': objectEvent
        }
      }
    }
  }
};

const getEventXml = function (objectEvent) {
  const eventJSON = wrapObjectEvent(objectEvent);
  return xmlbuilder.create(eventJSON).end({ pretty: true });
};

const receiving = function (sscc, depotId) {
  return getEventXml({
    'eventTime': {
      '#text': getCurrentTimeAsIsoString()
    },
    'eventTimeZoneOffset': {
      '#text': '+02:00'
    },
    'epcList': {
      'epc': {
        '#text': sscc
      }
    },
    'action': {
      '#text': 'OBSERVE'
    },
    'bizStep': {
      '#text': 'urn:epcglobal:cbv:bizstep:receiving'
    },
    'bizLocation': {
      'id': {
        '#text': depotId
      }
    }
  });
};

const shipping = function (sscc, depotId, receiverId) {
  return getEventXml({
    'eventTime': {
      '#text': getCurrentTimeAsIsoString()
    },
    'eventTimeZoneOffset': {
      '#text': '+02:00'
    },
    'epcList': {
      'epc': {
        '#text': sscc
      }
    },
    'action': {
      '#text': 'OBSERVE'
    },
    'bizStep': {
      '#text': 'urn:epcglobal:cbv:bizstep:shipping'
    },
    'disposition': {
      '#text': 'urn:epcglobal:cbv:disp:in_transit'
    },
    'bizLocation': {
      'id': {
        '#text': depotId
      }
    },
    'smile:personId': [
      { '#text': 'fahrerID' },
      { '#text': receiverId }
    ]
  });
};

const receiving2 = function (sscc, receiverId) {
  return getEventXml({
    'eventTime': {
      '#text': getCurrentTimeAsIsoString()
    },
    'eventTimeZoneOffset': {
      '#text': '+02:00'
    },
    'epcList': {
      'epc': {
        '#text': sscc
      }
    },
    'action': {
      '#text': 'OBSERVE'
    },
    'bizStep': {
      '#text': 'urn:epcglobal:cbv:bizstep:receiving'
    },
    'bizLocation': {
      'id': {
        '#text': 'fahrerId'
      }
    },
    'smile:personId': {
      '#text': receiverId
    }
  });
};

const send = function (eventXml) {
  const headers = { 'Content-Type': 'application/xml' };
  return request.post(SIS_EVENT_URL, {
    headers,
    body: eventXml,
    auth: { 'user': SIS_USERNAME, 'pass': SIS_PASSWORD }
  })
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = {
  receiving,
  shipping,
  receiving2,
  send
};