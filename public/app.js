var app = new Vue({
    el: '#app',
    data: {
        selectedCase: 1,
        scale: {
            lines: 20
        },
        ranges: {
            new: [
                {
                    companyName: "Microsoft super puper duper company INC",
                    companyAddress: "United States of America, FLorida, Miami, 12345",
                    start: "192.168.0.1",
                    end: "192.168.0.100",
                    offset: 150
                }
            ],
            existing: [
                {
                    companyName: "Microsoft super puper duper company INC",
                    companyAddress: "United States of America, FLorida, Miami, 12345",
                    start: "192.168.0.1",
                    end: "192.168.0.100",
                    offset: 100,
                    toUse: true
                },
                {
                    companyName: "Microsoft super puper duper company INC",
                    companyAddress: "United States of America, FLorida, Miami, 12345",
                    start: "192.168.0.1",
                    end: "192.168.0.100",
                    offset: 125,
                    toUse: true
                }
            ]
        }
    },
    mounted(){
        this.selectCase(1);
    },
    methods: {
        async selectCase(caseID){
            this.selectedCase = caseID;
            try{
                let response = await fetch(`https://raw.githubusercontent.com/sergiuchilat/wm-internal-tool/master/db/case-${caseID}.json`);
                this.ranges = {};
                this.ranges = Object.assign({}, await response.json());
                console.log(this.ranges);
                
            }catch(e){
                console.log(e);
            }
        }
    }
})