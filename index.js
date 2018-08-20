const Web3 = require('web3');
const $ = require("jquery")
const jsencrypt = require("jsencrypt")
//const Web3Bzz = require('web3-bzz')
//const bzz = new Web3Bzz('http://localhost:8500/');
//const swarm = require("swarm-js").at("'http://swarm-gateways.net/")
//console.log(jsencrypt);
//console.log(swarm);
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("localhost", "5001");
const multihashes = require('multihashes');
const utils = {
  ipfs2multihash(hash) {
    let mh = multihashes.fromB58String(Buffer.from(hash))
    return {
      hashFunction: '0x' + mh.slice(0, 2).toString('hex'),
      digest: '0x' + mh.slice(2).toString('hex'),
      size: mh.length - 2
    }
  },

  multihash2hash(hashFunction, digest, size, storageEngine) {
    storageEngine = web3.utils.hexToAscii(storageEngine)

    if (storageEngine === 'ipfs') {
      hashFunction = hashFunction.substr(2)
      digest = digest.substr(2)
      return {
        hash: multihashes.toB58String(multihashes.fromHexString(hashFunction + digest)),
        engine: storageEngine
      }
    }

    throw new Error('Unknown storage engine:', storageEngine)
  }
}
web3 = new Web3(window.web3.currentProvider);
const contractABI = [{
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "sender",
    "type": "address"
  }, {
    "indexed": false,
    "name": "receiver",
    "type": "address"
  }],
  "name": "LogRemoveData",
  "type": "event"
}, {
  "constant": false,
  "inputs": [{
    "name": "_receiverAddress",
    "type": "address"
  }],
  "name": "removeData",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "sender",
    "type": "address"
  }, {
    "indexed": false,
    "name": "receiver",
    "type": "address"
  }],
  "name": "LogNewData",
  "type": "event"
}, {
  "constant": false,
  "inputs": [{
    "name": "_name",
    "type": "string"
  }, {
    "name": "_publicKey",
    "type": "string"
  }],
  "name": "setProfile",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_digestSender",
    "type": "bytes32"
  }, {
    "name": "_hashFunctionSender",
    "type": "bytes2"
  }, {
    "name": "_hashSizeSender",
    "type": "uint8"
  }, {
    "name": "_storageEngingebytesSender",
    "type": "bytes4"
  }, {
    "name": "_digestreceiver",
    "type": "bytes32"
  }, {
    "name": "_hashFunctionreceiver",
    "type": "bytes2"
  }, {
    "name": "_hashSizereceiver",
    "type": "uint8"
  }, {
    "name": "_storageEngingebytesreceiver",
    "type": "bytes4"
  }, {
    "name": "_receiverAddress",
    "type": "address"
  }],
  "name": "shareData",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }, {
    "name": "",
    "type": "uint256"
  }],
  "name": "dataReceived",
  "outputs": [{
    "name": "currentName",
    "type": "string"
  }, {
    "name": "currentKey",
    "type": "string"
  }, {
    "name": "receiverAddress",
    "type": "address"
  }, {
    "name": "digest",
    "type": "bytes32"
  }, {
    "name": "hashFunction",
    "type": "bytes2"
  }, {
    "name": "hashSize",
    "type": "uint8"
  }, {
    "name": "storageEngine",
    "type": "bytes4"
  }, {
    "name": "timestamp",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }, {
    "name": "",
    "type": "uint256"
  }],
  "name": "dataShared",
  "outputs": [{
    "name": "currentName",
    "type": "string"
  }, {
    "name": "currentKey",
    "type": "string"
  }, {
    "name": "receiverAddress",
    "type": "address"
  }, {
    "name": "digest",
    "type": "bytes32"
  }, {
    "name": "hashFunction",
    "type": "bytes2"
  }, {
    "name": "hashSize",
    "type": "uint8"
  }, {
    "name": "storageEngine",
    "type": "bytes4"
  }, {
    "name": "timestamp",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_address",
    "type": "address"
  }],
  "name": "getDatareceivedCount",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_address",
    "type": "address"
  }],
  "name": "getDataSharedCount",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }],
  "name": "userProfile",
  "outputs": [{
    "name": "name",
    "type": "string"
  }, {
    "name": "publicKey",
    "type": "string"
  }, {
    "name": "ethAddress",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "uint256"
  }],
  "name": "users",
  "outputs": [{
    "name": "name",
    "type": "string"
  }, {
    "name": "publicKey",
    "type": "string"
  }, {
    "name": "ethAddress",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}];
const contractAddress = '0xe7502862b959e27a45d1744c51af66a43a4dc9f8';
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

function start() {
  initProfile();
  loadDataShared();
  loadDataReceived()
}
async function initProfile() {

  let userAddress = await web3.eth.getAccounts();
  let myProfile = await contractInstance.methods.userProfile(userAddress[0]).call();

  displayProfile(myProfile);
  document.getElementById("submit-data").addEventListener("click", setProfile, false);
  document.getElementById("share-data").addEventListener("click", shareData, false);
  document.getElementById("decrypt-data").addEventListener("click", decryptData, false);
  document.getElementById("remove-data").addEventListener("click", removeData, false);

}

async function setProfile() {

  let userAddress = await web3.eth.getAccounts();
  let _name = $('#userName').val();
  let _publicKey = $('#public-key').val();

  if (_name.trim() == '' || (_publicKey.trim() == '')) {
    alert("Enter some data");
    return false;
  }

  document.querySelector('#profile-content').innerHTML = 'Creating account, please wait...';
  let myProfile = await contractInstance.methods.setProfile(_name, _publicKey).send({
    from: userAddress[0]
  });

  initProfile();
}


async function displayProfile(profile) {
  $('#profile-content').empty();
  let profileContent = ''
  let myName = profile[0];
  let myPublicKey = profile[1];

  let userAddress = await web3.eth.getAccounts();



  if (!profile[0]) {
    // Has no profile
    profileContent += `
      <p>You have no <b>Swampkeeper</b> profile yet. Please create one.</p>
      <button class="btn btn-primary" data-toggle="modal" data-target="#profile-modal">Create profile</button>
    `;

    $('.card-shared-data, .card-received-data, .card-users').hide();


  } else {
    // There is a profile!

    $('#welcome-msg').html(`Welcome, ${myName}!`);
    $('.card-shared-data, .card-received-data, .card-users').fadeIn();

    profileContent += `
      <form>
        <div class="form-group">
          <label for="staticEmail" class="col-form-label">Name</label>
          <input type="text" class="form-control" readonly value="${myName}">
        </div>
        <div class="form-group">
          <label for="staticEmail" class="col-form-label">User address</label>
          <input type="text" readonly class="form-control" readonly value="${userAddress[0]}">
        </div>
        <div class="form-group">
          <label for="staticEmail" class="col-form-label">Public Key</label>
          <textarea id="card-key" class="form-control" rows="8" readonly>${myPublicKey}</textarea>
        </div>
      </form>

      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group mr-2" role="group" aria-label="First group">
          <button class="margin-update-btn btn btn-primary" data-toggle="modal" data-target="#profile-modal">Update profile</button>
        </div>
      </div>
    `;
  }

  document.querySelector('#profile-content').innerHTML = profileContent;

}

async function shareData() {

  let dataToUpload = ''
  let name = $('#_name').val();
  let email = $('#_email').val();
  let phone = $('#_phone').val();
  let recipient = $('#_recipient').val();
  let userAddress = await web3.eth.getAccounts();

  if ((name.trim() == '') || (email.trim() == '') || (phone.trim() == '') || (recipient.trim() == '')) {
    alert("Enter some data");
    return false;
  }
  if (recipient.trim() == '') {
    alert("Recipient is a required field");
  }
  if (name.trim() != '') {
    dataToUpload += `name: ${name}\n`
  }
  if (email.trim() != '') {
    dataToUpload += `email: ${email}\n`
  }
  if (phone.trim() != '') {
    dataToUpload += `phone: ${phone}`
  }

  let myHash = await encryptThenUpload(userAddress[0], dataToUpload);

  let recipientHash = await encryptThenUpload(recipient, dataToUpload);

  let contractCall = await contractInstance.methods.shareData(myHash[0].digest, myHash[0].hashFunction, myHash[0].size, myHash[1],
    recipientHash[0].digest, recipientHash[0].hashFunction, recipientHash[0].size, recipientHash[1], recipient).send({
    from: userAddress[0]
  });
  console.log(contractCall);
}

async function encryptThenUpload(address, dataToUpload) {

  let profile = await contractInstance.methods.userProfile(address).call();
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(profile[1]);
  var encrypted = encrypt.encrypt(dataToUpload);
  const ipfsCall = await ipfs.files.add({
    content: Buffer.from(encrypted)
  })
  let mh = utils.ipfs2multihash(ipfsCall[0].hash)
  let storageEngine = web3.utils.asciiToHex('ipfs');

  return [mh, storageEngine]
}

async function decryptData() {

  let decrypt = new JSEncrypt();
  decrypt.setPrivateKey($('#private-key').val());
  let hash = $('#ipfsHash').val();
  let fileBuffer = await ipfs.files.cat(hash);
  var uncrypted = decrypt.decrypt(fileBuffer.toString());
  if (uncrypted == false) {
    alert("Wrong key pair used, verify input")
    return;
  }
  $('#output').val(uncrypted);
  console.log(uncrypted);

}

async function loadDataShared() {
  console.log('loadDataShared()');
  let dataContent = '';
  let userAddress = await web3.eth.getAccounts();
  let dataCount = await contractInstance.methods.getDataSharedCount(userAddress[0]).call();
  console.log('dataCount:', dataCount);

  if (dataCount === "0") {
    // No shared data
    dataContent += '<small>No shared data yet.</small>';
  } else {
    for (i = 0; i < dataCount; i++) {
      let dataShared = await contractInstance.methods.dataShared(userAddress[0], i).call();
      if (dataShared[2] !== "0x0000000000000000000000000000000000000000") {
        let name = dataShared[0];
        let publicKey = dataShared[1];
        let counterpartAddress = dataShared[2];
        let digest = dataShared[3];
        let hashFunction = dataShared[4]
        let hashSize = dataShared[5];
        let storageEngine = dataShared[6];
        let timestamp = new Date(dataShared[7] * 1000);
        let clickableId = "clickpk" + i;
        let publicKeyId = "pkList" + i;
        let result = utils.multihash2hash(hashFunction, digest, hashSize, storageEngine);
        console.log(result);
        console.log('Hash:', result.hash);
        console.log('Provider:', result.engine);


        dataContent += `
          <div class="card">
            <div class="card-header">Shared data #${i}</div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label class="col-form-label">Shared to</label>
                  <input type="text" class="form-control" readonly value="${name}">
                </div>
                <div class="form-group">
                  <label class="col-form-label">User address</label>
                  <input type="text" readonly class="form-control" readonly value="${counterpartAddress}">
                </div>
                <div class="form-group">
                  <a class="btn btn-secondary btn-sm" data-toggle="collapse" href="#${clickableId}" role="button" aria-expanded="false" aria-controls="${clickableId}">
                    Show/hide public key
                  </a>
                  <div class="collapse" id="${clickableId}">
                    <div class="card card-body">
                      <textarea id="card-key" class="form-control" rows="8" disabled="true">${publicKey}</textarea>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Hash</label>
                  <input type="text" class="form-control" readonly value="${result.hash}">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Engine</label>
                  <input type="text" class="form-control" readonly value="${result.engine}">
                </div>
                <div class="form-group">
                  <label class="col-form-label">Date</label>
                  <input type="text" class="form-control" readonly value="${timestamp}">
                </div>
              </form>
            </div>
          </div>
        `
      }
    }
  }

  document.querySelector('#data-shared-content').innerHTML = dataContent;

}

async function loadDataReceived() {

  let dataContent = '' //'<small>No received data yet.</small>';
  let userAddress = await web3.eth.getAccounts();
  let dataCount = await contractInstance.methods.getDatareceivedCount(userAddress[0]).call();
  console.log(dataCount);
  for (i = 0; i < dataCount; i++) {
    let dataShared = await contractInstance.methods.dataReceived(userAddress[0], i).call();
    if (dataShared[2] !== "0x0000000000000000000000000000000000000000") {
      let name = dataShared[0];
      let publicKey = dataShared[1];
      let counterpartAddress = dataShared[2];
      let digest = dataShared[3];
      let hashFunction = dataShared[4]
      let hashSize = dataShared[5];
      let storageEngine = dataShared[6];
      let timestamp = new Date(dataShared[7] * 1000);
      let clickableId = "clickpublickey" + i;
      let publicKeyId = "publickeyList" + i;
      let result = utils.multihash2hash(hashFunction, digest, hashSize, storageEngine);
      console.log(timestamp);

      dataContent += `
      <div class="card">
        <div class="card-header">Data received #${i}</div>
        <div class="card-body">
          <form>
            <div class="form-group">
              <label class="col-form-label">Received from:</label>
              <input type="text" class="form-control" readonly value="${name}">
            </div>
            <div class="form-group">
              <label class="col-form-label">User address</label>
              <input type="text" readonly class="form-control" readonly value="${counterpartAddress}">
            </div>
            <div class="form-group">
              <a class="btn btn-secondary btn-sm" data-toggle="collapse" href="#${clickableId}" role="button" aria-expanded="false" aria-controls="${clickableId}">
                Show/hide public key
              </a>
              <div class="collapse" id="${clickableId}">
                <div class="card card-body">
                  <textarea id="card-key" class="form-control" rows="8" disabled="true">${publicKey}</textarea>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-form-label">Hash</label>
              <input type="text" class="form-control" readonly value="${result.hash}">
            </div>
            <div class="form-group">
              <label class="col-form-label">Engine</label>
              <input type="text" class="form-control" readonly value="${result.engine}">
            </div>
            <div class="form-group">
              <label class="col-form-label">Date</label>
              <input type="text" class="form-control" readonly value="${timestamp}">
            </div>
          </form>
        </div>
      </div>
    `
  }
}
  $('div[id^="publickeyList"]').addClass("hide");
  document.querySelector('#data-received').innerHTML = dataContent;
}
async function loadUsers() {
  let dataContent = '';
  let userAddress = await web3.eth.getAccounts();

  for (i = 0; i < 5; i++) {
    let userProfile = await contractInstance.methods.users(i).call();
    let name = userProfile[0];
    let publicKey = userProfile[1];
    let address = userProfile[2];

    dataContent += `
      <ul class="list-group list-group-flush">
      <li class="list-group-item">${name}</li>
      <li class="list-group-item">${counterpartAddress}</li>
      <button type="button" id="${clickableId}" class="list-group-item list-group-item-action">Public key</button>
      <div id="${publicKeyId}" class="hide">
      <textarea class="list-group-item" rows="16" cols="65" disabled="true">zeimel</textarea>
      </div>
      <li class="list-group-item">${result.hash}</li>
      <li class="list-group-item">${result.engine}</li>
      <li class="list-group-item">${timestamp}</li>
      </ul>
      </div>
      </div>
       `
  }

  $('div[id^="publickeyList"]').addClass("hide");
  document.querySelector('#data-subjects').innerHTML = dataContent;
}

async function removeData() {

  let userAddress = await web3.eth.getAccounts();
  let _address = $('#receiverAddr').val();

  if (_address.trim() == '') {
    alert("Enter some data");
    return false;
  }
    let dataRemoved = await contractInstance.methods.removeData(_address).send({
    from: userAddress[0]
  });
  $('#delete-confirm').val("Data removed")
}
start()
