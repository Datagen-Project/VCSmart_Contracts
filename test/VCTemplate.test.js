const VCTemplate = artifacts.require("./VCTemplate.sol");
const DataGen = artifacts.require("./DataGen.sol");

const {
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
    BN,
    time,
} = require('@openzeppelin/test-helpers');

require("chai").should();

contract("VCTemplate", accounts => {
    beforeEach(async function() {
        this.DataGenToken = await DataGen.new();

        this.contractVC = await VCTemplate.new(this.DataGenToken.address, accounts[4]);

        const fundDG = new BN("240000000000000000000000");
        this.DataGenToken.transfer(this.contractVC.address, fundDG, {from: accounts[0]});
    });

    describe("Initialise VCTemplate attributes", function() {
        it("has the correct release start time", async function() {
            const releaseStart = await this.contractVC.releaseStart();
            releaseStart.toString().should.equal("1703116800");
        });
        it("has the correct amount", async function() {
            const amount = await this.contractVC.amount();
            amount.toString().should.equal("240000000000000000000000");
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
            for (let i = 0; i < 24; i++) {
                await this.contractVC.releaseDataGen({from: accounts[4]});
                balanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
    
                console.log("Release %d -> %s",  (i+1), balanceOf4.toString()); 

                time.increase(time.duration.days(30));
            }

            const finalBalanceOf4 = await this.DataGenToken.balanceOf(accounts[4]);
            finalBalanceOf4.toString().should.equal("240000000000000000000000");
        });
    });
});