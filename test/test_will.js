require('chai').use(require('chai-as-promised')).should();

const { expect } = require("chai");

const Will = artifacts.require("Will.sol");

contract("Will", (accounts) => {
    describe("Test basic functionalities of post mortem will ", async () =>{
        let zero, remainingFortune, will;
        let owner = accounts[0];
        let firstChild = accounts[1];
        let firstChildInheritance = web3.utils.toWei("0.5", "ether");
        
        beforeEach(async () => {
            fortune = web3.utils.toWei("1", "ether");
            will = await Will.new({from: owner, value: fortune});
            // Setting the first child inheritance
            await will.setInheritance(accounts[1], firstChildInheritance, {from: owner});
            
        })
        
        it("Testing of Setting the inheritance ", async() => { 
            zero = 0    
            // Set inheritance
            let secondChildInheritance = web3.utils.toWei("0.5", "ether");
            await will.setInheritance(accounts[2], secondChildInheritance, {from: owner});
            // The Third inheritance should fail as they don't have enough money
            let thirdChildInheritance = web3.utils.toWei("0.5", "ether");
            await will.setInheritance(accounts[2], thirdChildInheritance, {from: owner}).should.be.rejected;
            
            // Remaining fortune should be zero after sharing is finished
            remainingFortune = await will.getRemainingFortune()
            assert(remainingFortune.toString() === zero.toString())
        })

        it("Testing who can initiate pay out", async() => {
            await will.hasBeenDeceased({from: accounts[1]}).should.be.rejected;
            await will.hasBeenDeceased({from: owner}).should.be.fulfilled;
        })

        it("Testing of Pay out", async() => {
            balance = await web3.eth.getBalance(firstChild)
            // Adding the Balance of the first child to the inheritance payment
            expectBalanceAfterPayOut = BigInt(balance) + BigInt(firstChildInheritance)
        
            await will.hasBeenDeceased({from: owner})
            balance = await web3.eth.getBalance(firstChild)
            // Testing the new balance of the first child after payout to be equal 
            expect(expectBalanceAfterPayOut).to.equal(BigInt(balance))
        })
    })
})