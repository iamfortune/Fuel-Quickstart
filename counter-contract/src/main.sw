contract;

storage {
    counter: u64 = 0,
}

abi Counter {
    #[storage(read)]
    fn count() -> u64;

    #[storage(read, write)]
    fn increment();
 
    #[storage(read, write)] 
    fn decrement(); 
    #[storage(read, write)]
    fn multiply(by: u64);

    #[storage(read, write)]
    fn reset(to: u64); 

}




impl Counter for Contract {
    #[storage(read)]
    fn count() -> u64 {
        storage.counter.read()
    }
 
    #[storage(read, write)]
    fn increment() {
        let incremented = storage.counter.read() + 1;
        storage.counter.write(incremented);
    }


    #[storage(read, write)] 
    fn decrement() {    
        let current = storage.counter.read();
        require(current > 0, "Counter cannot be decremented below 0"); 
    
        let decremented = current - 1;
        storage.counter.write(decremented);
    }

    #[storage(read, write)] 
    fn multiply(by: u64) {
        let current = storage.counter.read();
        let multiplied = current * by;
        storage.counter.write(multiplied);
    }


    #[storage(read, write)]
    fn reset(to: u64) {
        storage.counter.write(to);
    }

}


