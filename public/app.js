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
        this.selectCase(10);
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
            for(const newRange of this.ranges.new) {
                for(const existingRange of this.ranges.existing) {                      
                    if(existingRange.start <= newRange.start && existingRange.end >= newRange.end){
                        // console.log('existing', existingRange);
                        // console.log('new', newRange);
                        console.log('saving error');
                        return [
                            {
                                "companyName": "ERROR",
                                "companyAddress": "this combination can't be saved",
                                "startIP": "",
                                "endIP": "",
                                "start": newRange.start,
                                "end": newRange.end
                            }
                        ]
                    }
                } 
            }
            console.log('here');
            return results;
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
                this.ranges.results = this.generateResults().map(el => {
                    return {
                        ...el,
                        startOffset: this.calculateOffset(el.start),
                        height: this.calculateHeight(el.start, el.end)
                    }
                });
                
            }catch(e){
                console.log(e);
            }
        }
    }
})