var app = new Vue({
    el: '#app',
    data: {
        selectedCase: 1,
        totalCases: 15,
        scale: {
            lines: 20,
            lineHeight: 25
        },
        apiURL: "http://127.0.0.1:5500/db/",
        // apiURL: "https://raw.githubusercontent.com/sergiuchilat/wm-internal-tool/master/db/",
        ranges: {}
    },
    computed:{
        resultingRanges() {
            console.log(this.ranges.results);
            return this.ranges.results?.map(range => {
                if(!range.existing){
                    return range.new;
                }
                return this
                    .ranges
                    .existing
                    .find(
                        existingRange => 
                            existingRange.index === range.new?.index 
                            || 
                            existingRange.index.includes(range.new?.index))?.selected ? 
                            range.existing : range.new;
            });
        }
    },
    mounted(){
        this.selectCase(6);
    },
    methods: {
        calculateOffset(start){
            return this.scale.lineHeight * start;
        },
        calculateHeight(start, end) {
            return this.scale.lineHeight * ( end -  start);
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
                this.ranges.results = this.ranges.results?.map(el => {
                    let existingRange = null;
                    let newRange = null;
                    if(el.existing) {
                        existingRange = Object.assign({}, {
                            ...el.existing,
                            startOffset: this.calculateOffset(el.existing.start),
                            height: this.calculateHeight(el.existing.start, el.existing.end)
                        });
                    }
                    if(el.new) {
                        newRange = Object.assign({}, {
                            ...el.new,
                            startOffset: this.calculateOffset(el.new.start),
                            height: this.calculateHeight(el.new.start, el.new.end)
                        });
                    }
                    return {
                        existing: existingRange,
                        new: newRange
                    }
                });
                console.log(this.ranges.results);
            }catch(e){
                console.log(e);
            }
        }
    }
})