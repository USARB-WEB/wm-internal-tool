var app = new Vue({
    el: '#app',
    data: {
        selectedCase: 0,
        totalCases: 13,
        scale: {
            lines: 20,
            lineHeight: 25
        },
        // apiURL: "http://127.0.0.1:5500/db/",
        apiURL: "https://raw.githubusercontent.com/sergiuchilat/wm-internal-tool/master/db/",
        ranges: {}
    },
    mounted(){
        this.selectCase(0);
    },
    methods: {
        calculateOffset(start){
            return this.scale.lineHeight * start;
        },
        calculateHeight(start, end) {
            return this.scale.lineHeight * ( end -  start);
        },
        generateResults(){
            const results = [];

            this.ranges.existing.forEach(existingRange => {  
                this.ranges.new.forEach(newRange => {  
                    if(existingRange.start < newRange.start){

                    }
                }); 
            });
            console.log(results);
        },
        async selectCase(caseID){
            if(!caseID){
                return;
            }
            this.selectedCase = caseID;
            try{
                let response = await fetch(`${this.apiURL}case-${caseID}.json`);
                this.ranges = {};
                this.ranges = Object.assign({}, await response.json());
                this.ranges.existing = this.ranges.existing.map(el => {
                    return {
                        ...el,
                        startOffset: this.calculateOffset(el.start),
                        height: this.calculateHeight(el.start, el.end)
                    }
                });

                this.ranges.new = this.ranges.new.map(el => {
                    return {
                        ...el,
                        startOffset: this.calculateOffset(el.start),
                        height: this.calculateHeight(el.start, el.end)
                    }
                });
                this.generateResults();
                
            }catch(e){
                console.log(e);
            }
        }
    }
})