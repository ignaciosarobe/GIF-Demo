import AWS from './amazon';
import request from 'request';
import toArray from 'stream-to-array';
import crypto from 'crypto';
import mail from './mail';
import url from 'url';

const controller = {
  async signS3(req, res) {
    try {
      const params = await getS3Params();
      const data = await getSignedUrl(params);
      res.json({
        signedRequest: data,
        url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${params.Key}`
      })
    } catch (e) {
      console.log(e);
      res.status(500);
      res.json({ message: e.message });
    }
  },

  mail(req, res) {
    let gif = url.parse(req.body.link);
    gif = gif.path.replace('/', '');
    console.log(gif);
    const mailparams = {
      from: 'Xappia',
      to: req.body.mail,
      subject: 'Tu GIF de Xappia!',
      template: 'gif',
      context: {
        gif
      }
    };
    mail.sendMail(mailparams, function (err, info) {
      console.log("Error");
      if (err) {
        console.log(err);
        res.status(500);
        res.json(err.message);
      }
      console.log('email sent');
      res.json(info);
    });
  },

  testmail(req, res) {
    const mailparams = {
      from: 'Xappia',
      to: 'emmanuel.vazquez@xappia.com',
      subject: 'Tu GIF de Xappia!',
      template: 'gif',
      context: {
        gif: 'https://s3-us-west-2.amazonaws.com/xappia-demo/78cd091246a78f2b293c41db220919ac35021674.gif'
      }
    };
    mail.sendMail(mailparams, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500);
        res.json(err.message);
      }
      console.log('email sent');
      res.json(info);
    });
  }

};

const getS3Params = async () => {
  return {
    Bucket: process.env.S3_BUCKET,
    Key: `${(await randomBytes(20)).toString('hex')}.gif`,
    Expires: 60,
    ContentEncoding: 'base64',
    ContentType: 'image/gif',
    ACL: 'public-read'
  };
}

const getSignedUrl = (params) => {
  return new Promise((resolve, reject) => {
    AWS.getSignedUrl('putObject', params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

const randomBytes = (cantidad) => {
  return new Promise((fulfill, reject) => {
    crypto.randomBytes(cantidad, (error, buffer) => {
      if (error) {
        reject(error);
      }
      fulfill(buffer);
    });
  });
}

const checkAccount = async (id) => {
  try {
    const cuenta = await SF.sobject('Contact')
      .select('Id')
      .where({ Facebook_ID__c: id })
      .execute();
    return cuenta.length ? true : false
  } catch (e) {
    console.log(e);
  }
}

const createPhoto = (photo, contactID) => {
  return SF.sobject('FotoIA__c').create({
    Contacto__c: contactID,
    URL__c: photo.url,
    Comida__c: photo.classification.restaurant,
    Vacacion__c: photo.classification.vacation
  });
}

const setRekonitionID = (contactID, faceID) => {
  return SF.sobject('Contact').update({
    Id: contactID,
    Rekognition_id__c: faceID
  });
}

const getContactByRekognition = (rekognitionID) => {
  return SF.sobject('Contact').select('Id').where({
    Rekognition_id__c: rekognitionID
  });
}

const getBufferFromURL = (url) => {
  return new Promise((fulfill, reject) => {
    request.defaults({ encoding: null }).get(url, (err, res, body) => {
      if (err) reject(err);
      fulfill(body);
    });
  });
};

const getAttachmentFile = (attach) => {
  return new Promise((resolve, reject) => {
    request.defaults({ encoding: null }).get(`${SF.instanceUrl}${attach.Body}`, {
      'auth': {
        'bearer': SF.accessToken
      }
    }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
}

const addToIndex = async (photo) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      CollectionId: "DEMO_XAPPIA",
      Image: {
        Bytes: photo || 'STRING_VALUE',
      },
    };
    AWS.indexFaces(params, function (err, data) {
      console.log(data);
      if (err) reject(err)
      else resolve(data.FaceRecords.length ? data.FaceRecords[0].Face.FaceId : '');
    });
  });
}

const createContact = (firstName, lastName, id) => {
  return SF.sobject('Contact').create({
    FirstName: firstName,
    LastName: lastName,
    Facebook_ID__c: id
  });
}

const getContacts = () => {
  return SF.sobject('Contact').select('Id, Rekognition_id__c').execute();
}

const getAttachment = (id) => {
  return SF.sobject('Attachment').select('Id, Body').where({
    ParentId: id
  }).execute();
}

const detectLabels = (img) => {
  return new Promise((fulfill, reject) => {
    const params = {
      Image: {
        Bytes: img
      }
    };
    AWS.detectLabels(params, (err, data) => {
      if (err) reject(err);
      fulfill(data);
    });
  });
}

const compareFaces = (face1, face2) => {
  return new Promise((fulfill, reject) => {
    const params = {
      SimilarityThreshold: 90,
      SourceImage: {
        Bytes: face1
      },
      TargetImage: {
        Bytes: face2
      }
    };
    AWS.compareFaces(params, (err, data) => {
      if (err) reject(err);
      else fulfill(data);
    });
  });
}

const compareFaceCollection = (photo) => {
  return new Promise((resolve, reject) => {
    const params = {
      CollectionId: 'DEMO_XAPPIA', /* required */
      Image: { /* required */
        Bytes: photo
      },
    };
    AWS.searchFacesByImage(params, function (err, data) {
      if (err) reject(err);
      if (!data || !data.FaceMatches || !data.FaceMatches.length) reject('No coincide');
      else resolve(data.FaceMatches[0].Face.FaceId);
    });
  });
}

const classificate = (labels) => {
  const category = {
    vacation: 0,
    restaurant: 0
  };

  labels.map((x) => {
    for (let v = 0; v < VACATION_LABELS.length; v++) {
      if (x.Name === VACATION_LABELS[v]) {
        if (x.Confidence > category.vacation) {
          category.vacation = parseInt(x.Confidence);
        }
      }
    }

    for (let r = 0; r < RESTAURANT_LABELS.length; r++) {
      if (x.Name === RESTAURANT_LABELS[r]) {
        if (x.Confidence > category.restaurant) category.restaurant = parseInt(x.Confidence);
      }
    }
  });

  return category;
};

const createCollection = () => {
  return new Promise((resolve, reject) => {
    const params = {
      CollectionId: 'DEMO_XAPPIA'
    };
    AWS.createCollection(params, (err, data) => {
      if (err) {
        if (err.message.includes('already exists')) {
          resolve('OK');
        } else {
          reject(err);
        }
      }
      else resolve(data);
    });
  });
}

const decodeBase64Image = (dataString) => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


export default controller;
