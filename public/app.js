var app = new Vue({
    el: '#app',
    data: {
        selectedCase: 1,
        totalCases: 13,
        scale: {
            lines: 20,
            lineHeight: 25
        },
        apiURL: "http://127.0.0.1:5500/db/",
        ranges: {}
    },
    mounted(){
        this.selectCase(7);
    },
    methods: {
        calculateOffset(start){
            return this.scale.lineHeight * start;
        },
        calculateHeight(start, end) {
            return this.scale.lineHeight * ( end -  start);
        },
        async selectCase(caseID){
            this.selectedCase = caseID;
            try{
                let response = await fetch(`${this.apiURL}case-${caseID}.json`);
                this.ranges = {};
                this.ranges = Object.assign({}, await response.json());
                this.ranges.existing = this.ranges.existing.map(el => {
                    return {
                        ...el,
                        start: this.calculateOffset(el.start),
                        height: this.calculateHeight(el.start, el.end)
                    }
                });

                this.ranges.new = this.ranges.new.map(el => {
                    return {
                        ...el,
                        start: this.calculateOffset(el.start),
                        height: this.calculateHeight(el.start, el.end)
                    }
                });
                
            }catch(e){
                console.log(e);
            }
        }
    }
})