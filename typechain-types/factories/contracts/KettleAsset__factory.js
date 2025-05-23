/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Contract, ContractFactory, Interface, } from "ethers";
const _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "ERC721IncorrectOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "ERC721InsufficientApproval",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "approver",
                type: "address",
            },
        ],
        name: "ERC721InvalidApprover",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
        ],
        name: "ERC721InvalidOperator",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "ERC721InvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "ERC721InvalidReceiver",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "ERC721InvalidSender",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "ERC721NonexistentToken",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidInitialization",
        type: "error",
    },
    {
        inputs: [],
        name: "NotInitializing",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "length",
                type: "uint256",
            },
        ],
        name: "StringsInsufficientHexLength",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "approved",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "OperatorWhitelisted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "locked",
                type: "bool",
            },
        ],
        name: "TokenLocked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "TokenRevoked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "TransferApproved",
        type: "event",
    },
    {
        inputs: [],
        name: "BASE_URI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "approveOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "approveTransfer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "approvedTransfers",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getApproved",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
        ],
        name: "isApprovedForAll",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "locked",
                type: "bool",
            },
        ],
        name: "lockToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "lockedTokens",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "operators",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "ownerOf",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "revokeToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "baseURI",
                type: "string",
            },
        ],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "tokenURI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "asset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "tokenURI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60806040523460195760405161257661001f823961257690f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806301ffc9a7146101d257806306fdde03146101cd578063081812fc146101c8578063095ea7b3146101c357806313e7c9d8146101be57806323b872dd146101b957806329b35ab6146101b457806340c10f19146101af57806342842e0e146101aa57806355f804b3146101a55780636352211e146101a057806370a082311461019b578063715018a6146101965780637dc9e79b146101915780638da5cb5b1461018c57806395d89b4114610187578063a22cb46514610182578063b88d4fde1461017d578063c13a079414610178578063c4d66de814610173578063c87b56dd1461016e578063d854927114610169578063dbddb26a14610164578063dcec32941461015f578063e985e9c51461015a578063e9dc637514610155578063f2fde38b146101505763f789deb9036101ea57610a14565b6109da565b6109be565b6109a2565b610964565b610922565b6107e3565b6107ac565b610794565b610778565b610727565b6106bf565b6106a4565b610689565b610671565b610659565b61062e565b610613565b6105fb565b6104fb565b6104e2565b6104c9565b610478565b610434565b610395565b610335565b6102c2565b610219565b6001600160e01b031981165b036101ea57565b600080fd5b905035906101fc826101d7565b565b906020828203126101ea57610212916101ef565b90565b9052565b346101ea5761024761023461022f3660046101fe565b610a30565b6040515b91829182901515815260200190565b0390f35b60009103126101ea57565b60005b8381106102695750506000910152565b8181015183820152602001610259565b61029a6102a36020936102ad9361028e815190565b80835293849260200190565b95869101610256565b601f01601f191690565b0190565b602080825261021292910190610279565b346101ea576102d236600461024b565b6102476102dd610a84565b604051918291826102b1565b806101e3565b905035906101fc826102e9565b906020828203126101ea57610212916102ef565b6001600160a01b031690565b61021590610310565b6020810192916101fc919061031c565b346101ea5761024761035061034b3660046102fc565b610a97565b60405191829182610325565b6101e381610310565b905035906101fc8261035c565b91906040838203126101ea5761021290602061038e8286610365565b94016102ef565b346101ea576103ae6103a8366004610372565b90610aaa565b604051005b906020828203126101ea5761021291610365565b61021290610310906001600160a01b031682565b610212906103c7565b610212906103db565b906103f7906103e4565b600052602052604060002090565b610212916008021c5b60ff1690565b906102129154610405565b600061042f6102129260016103ed565b610414565b346101ea5761024761023461044a3660046103b3565b61041f565b90916060828403126101ea576102126104688484610365565b93604061038e8260208701610365565b346101ea576103ae61048b36600461044f565b91610b60565b8015156101e3565b905035906101fc82610491565b91906040838203126101ea576102129060206104c28286610365565b9401610499565b346101ea576103ae6104dc3660046104a6565b90610c65565b346101ea576103ae6104f5366004610372565b90610c86565b346101ea576103ae61050e36600461044f565b91610cb4565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761054b57604052565b610514565b906101fc61055d60405190565b928361052a565b6001600160401b03811161054b57602090601f01601f19160190565b90826000939282370152565b909291926105a161059c82610564565b610550565b93818552818301116101ea576101fc916020850190610580565b9080601f830112156101ea578160206102129335910161058c565b906020828203126101ea5781356001600160401b0381116101ea5761021292016105bb565b346101ea576103ae61060e3660046105d6565b610e7a565b346101ea576102476103506106293660046102fc565b610e83565b346101ea576102476106496106443660046103b3565b610eb3565b6040519182918290815260200190565b346101ea5761066936600461024b565b6103ae610f2a565b346101ea576103ae6106843660046102fc565b610f81565b346101ea5761069936600461024b565b610247610350610f9d565b346101ea576106b436600461024b565b6102476102dd610fc6565b346101ea576103ae6106d23660046104a6565b90610fd3565b906080828203126101ea576106ed8183610365565b926106fb8260208501610365565b9261070983604083016102ef565b9260608201356001600160401b0381116101ea5761021292016105bb565b346101ea576103ae61073a3660046106d8565b92919091610fde565b6080818303126101ea576107578282610365565b926102126107688460208501610365565b9360606104c282604087016102ef565b346101ea576103ae61078b366004610743565b92919091611011565b346101ea576103ae6107a73660046103b3565b611271565b346101ea576102476102dd6107c23660046102fc565b6112db565b91906040838203126101ea576102129060206104c282866102ef565b346101ea576103ae6107f63660046107c7565b90611362565b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b9060016002830492168015610848575b602083101461084357565b610812565b91607f1691610838565b8054600093929161086f61086583610828565b8085529360200190565b91600181169081156108c1575060011461088857505050565b61089b9192939450600052602060002090565b916000925b8184106108ad5750500190565b8054848401526020909301926001016108a0565b92949550505060ff1916825215156020020190565b9061021291610852565b906101fc6108fa926108f160405190565b938480926108d6565b038361052a565b9060001061091257610212906108e0565b6107fc565b610212600080610901565b346101ea5761093236600461024b565b6102476102dd610917565b6102126102126102129290565b906103f79061093d565b600061042f61021292600261094a565b346101ea5761024761023461097a3660046102fc565b610954565b91906040838203126101ea5761021290602061099b8286610365565b9401610365565b346101ea576102476102346109b836600461097f565b9061136c565b346101ea576102476102dd6109d4366004610372565b90611495565b346101ea576103ae6109ed3660046103b3565b611546565b61021292610a0f600093610a0a61042f9460036103ed565b6103ed565b61094a565b346101ea57610247610234610a2a36600461044f565b916109f2565b6380ac58cd60e01b6001600160e01b0319821614908115610a60575b8115610a56575090565b610212915061154f565b6001600160e01b03198116635b5e139f60e01b149150610a4c565b610212906108e0565b6102126000610a9161156d565b01610a7b565b61021290610aa481611591565b506115d6565b6101fc9133916115fb565b6102129061040e565b6102129054610ab5565b15610acf57565b60405162461bcd60e51b815260206004820152600c60248201526b1513d2d15397d313d0d2d15160a21b604482015280606481015b0390fd5b15610b0f57565b60405162461bcd60e51b815260206004820152602360248201527f4e4f545f415554484f52495a45445f4f50455241544f525f4f525f5452414e536044820152622322a960e91b6064820152608490fd5b916000916101fc93610b8a610b85610b81610b7c86600261094a565b610abe565b1590565b610ac8565b610b98610b7c3360016103ed565b8015610bb8575b610ba890610b08565b610bb3838383611636565b6116ba565b50610ba8610bd2610b7c85610a0f86610a0a8760036103ed565b9050610b9f565b906101fc91610be661171a565b610c15565b9060ff905b9181191691161790565b90610c0a610212610c1192151590565b8254610beb565b9055565b610c60610c567f67a9140af3a1924dd071fca7a7245c954e029768ad9a3a500e3db4886105f0ed92610c5185610c4c8360016103ed565b610bfa565b6103e4565b9261023860405190565b0390a2565b906101fc91610bd9565b906101fc91610c7c61171a565b906101fc9161175c565b906101fc91610c6f565b90610c9d61059c83610564565b918252565b6102126000610c90565b610212610ca2565b90916101fc92610cc2610cac565b92610fde565b6101fc90610cd461171a565b610e6f565b9160001960089290920291821b911b610bf0565b9190610cfe610212610c119361093d565b908354610cd9565b6101fc91600091610ced565b818110610d1d575050565b80610d2b6000600193610d06565b01610d12565b9190601f8111610d4057505050565b610d526101fc93600052602060002090565b906020601f840181900483019310610d74575b6020601f909101040190610d12565b9091508190610d65565b9060001960089091021c191690565b81610d9791610d7e565b906002021790565b90610da8815190565b906001600160401b03821161054b57610dcb82610dc58554610828565b85610d31565b602090601f8311600114610df957610c11929160009183610dee575b5050610d8d565b015190503880610de7565b601f19831691610e0e85600052602060002090565b9260005b818110610e4d57509160029391856001969410610e33575b50505002019055565b610e43910151601f841690610d7e565b9055388080610e2a565b91936020600181928787015181550195019201610e12565b906101fc91610d9f565b6101fc906000610e65565b6101fc90610cc8565b61021290611591565b6103106102126102129290565b61021290610e8c565b6102129081565b6102129054610ea2565b610ebb61156d565b6000610ec681610e99565b610ecf81610310565b610ed885610310565b14610ef4575050610212916003610eef92016103ed565b610ea9565b6322718ad960e21b82528190610b049060048301610325565b610f1561171a565b6101fc6101fc610f256000610e99565b611794565b6101fc610f0d565b6101fc90610f3e61171a565b610f5090610f4b81611807565b61093d565b7fdd1d49ebfce788b875cea0c153d8c2714b07c405b7cb2ed4989f22df886da0ba610f7a60405190565b8080610c60565b6101fc90610f32565b61021290610310565b6102129054610f8a565b6102127f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610f93565b6102126001610a9161156d565b6101fc919033611833565b906101fc939291610ff0838383610b60565b3361193e565b906101fc93929161100561171a565b906101fc9392916116ba565b906101fc939291610ff6565b6102129060401c61040e565b610212905461101d565b610212905b6001600160401b031690565b6102129054611033565b6110386102126102129290565b906001600160401b0390610bf0565b611038610212610212926001600160401b031690565b90611090610212610c119261106a565b825461105b565b9060ff60401b9060401b610bf0565b906110b6610212610c1192151590565b8254611097565b6102159061104e565b6020810192916101fc91906110bd565b6110de611a5d565b90816110f56110ef610b8183611029565b91611044565b906000926111028461104e565b6001600160401b0384161480611200575b60019361112f6111228661104e565b916001600160401b031690565b1490816111d8575b155b90816111cf575b506111c0576111699082611160866111578761104e565b98019788611080565b6111b15761124f565b61117257505050565b6111a06111ac927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2946110a6565b604051918291826110c6565b0390a1565b6111bb84876110a6565b61124f565b63f92ee8a960e01b8452600484fd5b15905038611140565b90506111396111e6306103e4565b3b6111f76111f38861093d565b9190565b14919050611137565b5081611113565b6112116006610c90565b654b6574746c6560d01b602082015290565b610212611207565b6112356006610c90565b654b4554544c4560d01b602082015290565b61021261122b565b6101fc9061126c61125e611223565b611266611247565b90611a7c565b611a9b565b6101fc906110d6565b6102ad6112929260209261128c815190565b94859290565b93849101610256565b6112a990610212939261127a565b9061127a565b6112cf92916101fc916112c160405190565b94859260208401928361129b565b9081038252038361052a565b6112e481611591565b506112ed611aa4565b80516112fc6111f3600061093d565b11156113145761130e61021292611af9565b906112af565b5050610212610cac565b906101fc9161132b61171a565b610c60610c567f1061f8ecbb11992f94e9b36dac8f2d92c62e763f626409b6d965ea3dab3549a892610f4b85610c4c83600261094a565b906101fc9161131e565b61021291610a0a610b7c9261137f600090565b50600561138a61156d565b016103ed565b6102129081906001600160a01b031681565b6113b2600191610212949361127a565b602f60f81b8152019061127a565b6112cf92916101fc916113d260405190565b9485926020840192836113a2565b6102129054610828565b805460009392916114016113fd83610828565b9390565b9160018116908115611452575060011461141a57505050565b61142d9192939450600052602060002090565b6000905b83821061143e5750500190565b600181602092548486015201910190611431565b60ff191683525050811515909102019150565b6113b260019161021294936113ea565b6112cf92916101fc9161148760405190565b948592602084019283611465565b906114c46114be6114b96114b46114ca956114ae606090565b506103db565b611390565b611b8c565b91611af9565b906113c0565b60006114d5816113e0565b6114e16111f38361093d565b146114f0579061021291611475565b5090565b6101fc9061150061171a565b600061150b81610e99565b61151481610310565b61151d84610310565b1461152d5750506101fc90611794565b631e4fbdf760e01b82528190610b049060048301610325565b6101fc906114f4565b6115696301ffc9a760e01b5b916001600160e01b03191690565b1490565b7f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab007930090565b61159a81611bac565b906000906115af6115aa83610e99565b610310565b6115b884610310565b146115c257505090565b637e27328960e01b82526004820152602490fd5b6115f6610212916115e5600090565b5060046115f061156d565b0161094a565b610f93565b916001916101fc93611bc6565b60409061162f6101fc94969593966116286060840198600085019061031c565b6020830152565b019061031c565b909160009261164484610e99565b61164d81610310565b61165683610310565b146116a1575061166890823391611d20565b9161167281610310565b61167b84610310565b036116865750505050565b6364283d7b60e01b84528392610b0492909160048501611608565b84610b048192633250574960e11b835260048301610325565b61171561170b6117056116ff7fcd8abfdc75f3dcde74f08c0644f77cf1a0a07afffd5fac73c37a24ba12ab43f594610c5189610c4c8a610a0f8b610a0a8760036103ed565b946103e4565b9461093d565b9461023860405190565b0390a4565b611722610f9d565b339061173661173083610310565b91610310565b0361173e5750565b63118cdaa760e01b600090815290611757906004610325565b036000fd5b6101fc91611768610cac565b91611e63565b906001600160a01b0390610bf0565b9061178d610212610c11926103e4565b825461176e565b6117d46117ce7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610c51846117c883610f93565b9261177d565b916103e4565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06117ff60405190565b80805b0390a3565b60009061181382610e99565b61182a611730611824838581611d20565b92610310565b146115c2575050565b61183b61156d565b60006118496115aa82610e99565b61185285610310565b146118a8575061189e61189883610c5187610c4c88610a0a7f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c319960056118029a016103ed565b936103e4565b9361023860405190565b630b61174360e31b815280610b048560048301610325565b905051906101fc826101d7565b906020828203126101ea57610212916118c0565b90926119129061190b61021296946119016080860197600087019061031c565b602085019061031c565b6040830152565b6060818403910152610279565b3d156119395761192e3d610c90565b903d6000602084013e565b606090565b600094929390843b6119526111f38861093d565b11611960575b505050505050565b60209286611970610c51886103e4565b9261199761197d60405190565b97889687958694630a85bd0160e11b8652600486016118e1565b03925af160009181611a2c575b506119f757506119ba565b388080808080611958565b6119c261191f565b80516119d06111f38561093d565b036119ef5750633250574960e11b82528190610b049060048301610325565b805190602001fd5b611a07630a85bd0160e11b61155b565b03611a135750506119af565b633250574960e11b82528190610b049060048301610325565b611a4f91925060203d602011611a56575b611a47818361052a565b8101906118cd565b90386119a4565b503d611a3d565b610212611ead565b906101fc91611a72611eb5565b906101fc91611f04565b906101fc91611a65565b6101fc90611a92611eb5565b6101fc90611f1a565b6101fc90611a86565b610212610cac565b369037565b906101fc611ac7611ac184610c90565b93610564565b601f190160208401611aac565b634e487b7160e01b600052601260045260246000fd5b8115611af4570490565b611ad4565b611b0281611f23565b90611b136001926102ad600161093d565b9180611b1e84611ab1565b936020018401905b611b31575b50505090565b8115611b8757611b6b9060001901926f181899199a1a9b1b9c1cb0b131b232b360811b600a82061a8453611b65600a61093d565b90611aea565b9081611b7a6111f3600061093d565b14611b8757909181611b26565b611b2b565b61021290611ba6611b9c82612110565b6102ad600161093d565b9061227f565b6115f661021291611bbb600090565b5060026115f061156d565b929091611bd161156d565b91808115611ce1575b611bf7575b50506101fc92916004611bf2920161094a565b61177d565b611c0084611591565b91600090611c106115aa83610e99565b611c1982610310565b141580611cc7575b80611cb4575b611c9b575050611bf2926101fc959492600492611c4b575b50925081939450611bdf565b611c54906103e4565b611c5d866103e4565b611c668561093d565b917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925611c9160405190565b600090a438611c3f565b63a9fbf51f60e01b82528190610b049060048301610325565b50611cc2610b81828661136c565b611c27565b50611cd181610310565b611cda85610310565b1415611c21565b50611cef6115aa6000610e99565b611cf883610310565b1415611bda565b9060001990610bf0565b90611d19610212610c119261093d565b8254611cff565b90611d9b82611bf2836002611d3361156d565b611d87611d3f84611bac565b9960008b86611d4d83610e99565b93611d5785610310565b611d6082610310565b03611e52575b505050611d7282610310565b611d7b8d610310565b03611e14575b50610310565b611d9086610310565b03611de2570161094a565b611db0611daa611898856103e4565b9161093d565b917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef611ddb60405190565b600090a490565b611e0f611def600161093d565b611e09611dff88600386016103ed565b916102ad83610ea9565b90611d09565b6115f0565b611e2090828781611bc6565b611e4c8b611e09611e3e611e34600161093d565b92600388016103ed565b91611e4883610ea9565b0390565b38611d81565b611e5b926123d3565b8b8638611d66565b906101fc9291611e738282612433565b33611e7e6000610e99565b9061193e565b6102127ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061093d565b610212611e84565b611ec0610b816124a9565b611ec657565b631afcd79f60e31b6000908152600490fd5b906101fc91611ee5611eb5565b9060016101fc92611efe611ef761156d565b9182610e65565b01610e65565b906101fc91611ed8565b6101fc90611500611eb5565b6101fc90611f0e565b611f2d600061093d565b9072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b611f4e8161093d565b82101561209e575b506d04ee2d6d415b85acef8100000000611f6f8161093d565b82101561207c575b50662386f26fc10000611f898161093d565b82101561205a575b506305f5e100611fa08161093d565b821015612038575b50612710611fb58161093d565b821015612016575b50611fc8606461093d565b811015611ff4575b611fdd6111f3600a61093d565b1015611fe65790565b610212906102ad600161093d565b61200561201091611b65606461093d565b916102ad600261093d565b90611fd0565b61203191611b656120269261093d565b916102ad600461093d565b9038611fbd565b61205391611b656120489261093d565b916102ad600861093d565b9038611fa8565b61207591611b6561206a9261093d565b916102ad601061093d565b9038611f91565b61209791611b6561208c9261093d565b916102ad602061093d565b9038611f77565b6120b991611b656120ae9261093d565b916102ad604061093d565b9038611f56565b61040e6102126102129290565b610212906120e16111f36102129460ff1690565b901b90565b610212906120f76111f36102129490565b901c90565b610212906120f76111f36102129460ff1690565b6121ea6121dd61214261213261212c6001600160801b0361093d565b855b1190565b61213c60076120c0565b906120cd565b61216f61216561215283876120e6565b61212e6111f36001600160401b0361093d565b61213c60066120c0565b1761219a61219061218083876120e6565b61212e6111f363ffffffff61093d565b61213c60056120c0565b176121c36121b96121ab83876120e6565b61212e6111f361ffff61093d565b61213c60046120c0565b176121d76121d160036120c0565b826120fc565b936120e6565b61212e6111f360ff61093d565b1790565b634e487b7160e01b600052601160045260246000fd5b8181029291811591840414171561221757565b6121ee565b9190820180921161221757565b634e487b7160e01b600052603260045260246000fd5b90612248825190565b811015612256570160200190565b612229565b8015612217576000190190565b9081526040810192916101fc9160200152565b0152565b9081906122b06122ab61229b83612296600261093d565b612204565b6122a5600261093d565b9061221c565b611ab1565b9260009260306122c86122c28661093d565b8761223f565b536001600f60fb1b851a6122e46122de8361093d565b8861223f565b53806123006122f786612296600261093d565b6122a58361093d565b915b612339575b50506123156111f38561093d565b036123205750505090565b63e22e27eb60e01b83528291610b049160048401612268565b90916123448261093d565b8311156123b2576f181899199a1a9b1b9c1cb0b131b232b360811b612369600f61093d565b82169060108210156122565783926123896123a6926123ac941a60f81b90565b891a612395878c61223f565b536123a060046120c0565b906120fc565b9361225b565b91612302565b91612307565b9160206101fc92949361227b6040820196600083019061031c565b906123e2610b818483856124bc565b6123eb57505050565b60009283926123ff6117306115aa86610e99565b0361241c57637e27328960e01b8352600483015250602481010390fd5b63177e802f60e01b8352610b0491600484016123b8565b60009161243f83610e99565b9161244983610310565b61245282610310565b1461249057612462918391611d20565b61246e61173083610310565b03612477575050565b6339e3563760e11b82528190610b049060048301610325565b633250574960e11b84528380610b048560048301610325565b61021260006124b6611a5d565b01611029565b906124ca6115aa6000610e99565b6124d382610310565b141592836124e15750505090565b909192506124ee82610310565b6124f784610310565b1492831561252c575b508215612512575b5050388080611b2b565b612524919250611824611730916115d6565b143880612508565b612539919350829061136c565b913861250056fea2646970667358221220ee244f78e75cc3a3ef526589fbf80d74a787d3eb8e04df94ca453df9bc8ae24664736f6c634300081c0033";
const isSuperArgs = (xs) => xs.length > 1;
export class KettleAsset__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new Interface(_abi);
    }
    static connect(address, runner) {
        return new Contract(address, _abi, runner);
    }
}
KettleAsset__factory.bytecode = _bytecode;
KettleAsset__factory.abi = _abi;
