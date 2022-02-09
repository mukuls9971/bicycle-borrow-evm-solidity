.PHONY: all
all:
	echo "working fine "

.PHONY: build
build:
	echo "building now "
	truffle migrate --reset

.PHONY: deployaurora
deployaurora:
	echo "building now "
	truffle migrate --reset --network aurora

.PHONY: test
test:
	echo "testing now"
	truffle test ./test/test.js 
	# truffle test ./test/test.js --network test

.PHONY: debug
debug:
	echo "debugging now"
	truffle test --debug ./test/test.js --network test 

	


# truffle unbox metacoin
# truffle compile
# truffle migrate
# truffle console
# truffle test ./test/TestMetaCoin.sol
# truffle test ./test/metacoin.js
# truffle networks 
# truffle migrate --network aurora


# # truffle console 
# let instance = await Erctest.deployed()
# let accounts = await web3.eth.getAccounts()
# let s = await instance.totalSupply()
# s.toString()
# let d = await instance.decimals()
# d.toString()