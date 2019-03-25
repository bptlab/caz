var request = require('request-promise');
const UNICORN_BASE_URL = process.env.UNICORN_BASE_URL || "http://unicorn:8080/unicorn";

const getEPCISQueryDocumentForObjectEvent = (objectEvent) => `
    <epcisq:EPCISQueryDocument schemaVersion="1.2" creationDate="2019-03-25T14:29:56.7Z" xmlns:epcis="urn:epcglobal:epcis:xsd:1" xmlns:epcismd="urn:epcglobal:epcis-masterdata:xsd:1" xmlns:sbdh="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" xmlns:epcisq="urn:epcglobal:epcis-query:xsd:1" xmlns:epcglobal="urn:epcglobal:xsd:1" xmlns:eecc="http://ns.eecc.info/epcis" xmlns:smile="http://ns.smile-project.de/epcis" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="ParcelDataCreated.xsd">
      <EPCISBody>
        <epcisq:QueryResults>
          <queryName>SimpleEventQuery</queryName>
          <resultsBody>
            <EventList>
              ${objectEvent}
            </EventList>
          </resultsBody>
        </epcisq:QueryResults>
      </EPCISBody>
    </epcisq:EPCISQueryDocument>`;

const sendEventToUnicorn = (event) => {
  return request({
    uri: `${UNICORN_BASE_URL}/webapi/REST/Event`,
    method: 'POST',
    headers: {'content-type': 'application/xml'},
    body: event
  });
};

module.exports = {
  getEPCISQueryDocumentForObjectEvent,
  sendEventToUnicorn
};