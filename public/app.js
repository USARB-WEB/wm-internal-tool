var app = new Vue({
    el: '#app',
    data: {
        selectedCase: 0,
        totalCases: 15,
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
                        return [
                            {
                                "companyName": "ERROR",
                                "companyAddress": "this combination can't be saved",
                                "startIP": "",
                                "endIP": "",
                                "start": newRange.start,
                                "end": newRange.end,
                                type: 'error'
                            }
                        ]
                    } else if(existingRange.start === newRange.start && existingRange.end < newRange.end){
                        existingRange.type = 'existing';
                        results.push(existingRange);
                        newRange.start = existingRange.end;
                        newRange.type = 'new';
                        results.push(newRange);
                    } else if(existingRange.end === newRange.end && existingRange.start > newRange.start){
                        existingRange.type = 'existing';
                        results.push(existingRange);
                        newRange.end = existingRange.start;
                        newRange.type = 'new';
                        results.push(newRange);
                    } else if(existingRange.start > newRange.start && existingRange.end < newRange.end){
                        const newRangeFirst = Object.assign({}, newRange);
                        const newRangeSecond = Object.assign({}, newRange);

                        newRangeFirst.end = existingRange.start;
                        newRangeSecond.start = existingRange.end;

                        newRangeFirst.type = 'new';
                        existingRange.type = 'existing';
                        newRangeSecond.type = 'new';

                        results.push(newRangeFirst);
                        results.push(existingRange);
                        results.push(newRangeSecond);
                    } else if (existingRange.start < newRange.start && existingRange.end > newRange.start){
                        existingRange.type = 'existing';
                        results.push(existingRange);
                        newRange.start = existingRange.end;
                        newRange.type = 'new';
                        results.push(newRange);
                    } else if (existingRange.start < newRange.end && existingRange.end > newRange.end){
                        existingRange.type = 'existing';
                        results.push(existingRange);
                        newRange.end = existingRange.start;
                        newRange.type = 'new';
                        results.push(newRange);
                    }
                } 
            }
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