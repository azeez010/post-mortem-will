// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Will {
    address owner;
    uint fortune;
    bool Deceased;
    uint unassignFortune;

    constructor() payable {
        owner =  msg.sender;
        fortune = msg.value;
        Deceased = false;
        unassignFortune = fortune;
    }

    address payable[] childrenWallets;

    // create modifiers to restrict access
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier isDeceased {
        require(Deceased == true);
        _;
    }

    mapping(address => uint) children;

    function setInheritance(address payable wallet, uint amount) public onlyOwner{
        require(unassignFortune >= amount, "Cannot set inheritance to less than unassigned fortune");
        childrenWallets.push(wallet);
        if (amount > 0) {
            // Remove the amount from the  unassigned fortune
            unassignFortune -= amount;
            children[wallet] += amount;
        }
    }

    function payOut() private isDeceased {
        for(uint i = 0; i < childrenWallets.length; i++){
            // transferring crypto to childrens' wallet
            childrenWallets[i].transfer(children[childrenWallets[i]]);
        }
    }

    function hasBeenDeceased() public onlyOwner{
        Deceased = true;
        payOut();
    }

    function getRemainingFortune() public view returns(uint){
        return unassignFortune;
    }
} 