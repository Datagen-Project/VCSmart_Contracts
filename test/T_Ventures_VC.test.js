const TVentures = artifacts.require("./T_Ventures_VC.sol");
const DataGen = artifacts.require("./DataGen.sol");

const {
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
    BN,
    time,
} = require('@openzeppelin/test-helpers');

require("chai").should();

contract("TVentures", accounts => {
    beforeEach(async function() {
        this.DataGenToken = await DataGen.new();

        this.contractVC = await TVentures.new(this.DataGenToken.address, accounts[4]);

        const fundDG = new BN("100000000000000000000000");
        this.DataGenToken.transfer(this.contractVC.address, fundDG, {from: accounts[0]});
    });

    describe("Initialise TVentures attributes", function() {
        it("has the correct release start time", async function() {
            const releaseStart = await this.contractVC.releaseStart();
            releaseStart.toString().should.equal("1703116800");
        });
        it("has the correct amount", async function() {
            const amount = await this.contractVC.amount();
            amount.toString().should.equal("100000000000000000000000");
        });
    });
    describe("#DG Release", function() {
        it("has to transfer the correct first amount", async function() {
            await this.contractVC.releaseDataGen({from: accounts[4]});
            const balanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);

            balanceOf4.toString().should.equal("10000000000000000000000");
        });
        it("has to revert if try to get two times the same release", async function() {
            await this.contractVC.releaseDataGen({from: accounts[4]});

            await expectRevert(
                this.contractVC.releaseDataGen({from: accounts[4]}),
                "Already released."
            )
        });
        it("has to transfer all the #DG", async function() {
            for (let i = 0; i < 10; i++) {
                await this.contractVC.releaseDataGen({from: accounts[4]});
                balanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
    
                console.log("Release %d -> %s",  (i+1), balanceOf4.toString()); 

                time.increase(time.duration.days(30));
            }

            const finalBalanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
            finalBalanceOf4.toString().should.equal("100000000000000000000000");
        });
        it("has to revert if there aeren't no more #DGs in the sc", async function() {
            for (let i = 0; i < 10; i++) {
                await this.contractVC.releaseDataGen({from: accounts[4]});
                balanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
    
                console.log("Release %d -> %s",  (i+1), balanceOf4.toString()); 

                time.increase(time.duration.days(30));
            }

            await expectRevert(
                this.contractVC.releaseDataGen(),
                "Zero #DG left."
            );
        });
    });
    describe("change VcWallet", async function() {
        it("has to revert if user aren't the old vc address", async function() {
            await expectRevert(
                this.contractVC.setVcWallet(accounts[5], {from:accounts[0]}),
                "You are not the Vc owner"
            );
        });
        it("has to transfer the vc ownership to an other wallet", async function() {
            this.contractVC.setVcWallet(accounts[5], {from: accounts[4]});

            const vcWallet = await this.contractVC.vcWallet();

            vcWallet.toString().should.equal(accounts[5].toString());
        });
        it("has to transfer first release on a wallet than to another one", async function() {
            await this.contractVC.releaseDataGen();
            await this.contractVC.setVcWallet(accounts[5], {from: accounts[4]});

            time.increase(time.duration.days(30));
            await this.contractVC.releaseDataGen();

            const balanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
            const balanceOf5 = await this.DataGenToken.balanceOf(accounts[5]);

            const checkString = balanceOf4.toString() + balanceOf5.toString();

            checkString.should.equal("1000000000000000000000010000000000000000000000");
        });
    }); 
});