<script>
    import axios from 'axios';
    import base from './utils/setting';


    export default {
        data() {
            return {
                totalDek: 0,
                statusReason: false,
                statusBtnRandom: true,
                statusStep: {
                    dek: false,
                    passcode: false
                },
                dataStd: [],
                dataPasscode: [],
                result_reason: '',
                result_noDek65: '🙋‍♂️🙋‍♀️',
                result_passcode: '🤷‍♂️🤷‍♀️',
                data_dek: {
                    no: '',
                    fullname: '',
                    nickname: '',
                    sec: ''
                },
                dataHistory: []
            }
        },
        methods: {
            playFileSound(sound) {
                if(sound) {
                    var audio = new Audio(sound);
                    audio.volume = 0.2;
                    audio.play();
                }
            },
            playSound(lang, messageSpeech, speedRate=0.8) {
                var speechSynthesis = new SpeechSynthesisUtterance();
                speechSynthesis.voiceURI = 'native';
                speechSynthesis.volume = 1; // 0 to 1
                // speechSynthesis.rate = speedRate; // 0.1 to 10
                // speechSynthesis.pitch = 2; //0 to 2
                if (lang === 'th') {
                    speechSynthesis.lang = 'th-TH';
                } else if (lang === 'en') {
                    speechSynthesis.lang = 'en-US';                
                }

                speechSynthesis.text = messageSpeech;
                window.speechSynthesis.speak(speechSynthesis);
            },
            clearRandom(A, B, C) {
                setTimeout(() => {
                    clearInterval(A);
                    setTimeout(() => {
                        clearInterval(B);
                        setTimeout(() => {
                            clearInterval(C);
                        }, 1000);
                    }, 1500);
                }, 2000);
            },
            onRandom(data) {
                var result = data[Math.floor(Math.random() * data.length)];
                return result;
            },
            onRandomDek() {
                if (this.dataStd.length === 0) {
                    alert('Data std notFound!');
                    return;
                }
                if (this.dataPasscode.length === 0) {
                    alert('Data passcode notFound!');
                    return;
                }
                if (!this.statusBtnRandom) { return; }


                this.result_reason = '';
                this.statusReason = false;
                this.statusBtnRandom = false;
                this.statusStep.dek = false;
                this.statusStep.passcode = false;
                
                this.result_noDek65 = '🙋‍♂️🙋‍♀️'
                this.result_passcode = '🤷‍♂️🤷‍♀️'

                let tmpRandom = null;
                setTimeout(() => {
                    document.querySelector('#playSoundRandom').click();
                    if (this.dataStd.length > 1) {
                        this.clearRandom(
                            setInterval(() => {
                                tmpRandom = this.onRandom(this.dataStd);
                                this.result_noDek65 = tmpRandom.no; 
                            }, 50),
                            setInterval(() => {
                                tmpRandom = this.onRandom(this.dataStd);
                                this.result_noDek65 = tmpRandom.no; 
                            }, 400),
                            setInterval(() => {
                                tmpRandom = this.onRandom(this.dataStd);
                                this.result_noDek65 = tmpRandom.no; 
                            }, 1000)
                        )
                        setTimeout(() => {
                            this.data_dek.no = tmpRandom.no || '';
                            this.data_dek.fullname = tmpRandom.fullname; // (tmpRandom.firstname + ' ' + tmpRandom.lastname) || '';
                            this.data_dek.nickname = (tmpRandom.nickname != '' ? '\"' + tmpRandom.nickname + '\"' : '') || '';
                            this.data_dek.sec = tmpRandom.sec || '';
                            this.statusStep.dek = true;
                            this.playSound('th', `สุ่มน้องได้ลำดับที่ ${tmpRandom.no}`);
                            this.playSound('th', `${tmpRandom.fullname.split(' ')[0]}   ${tmpRandom.fullname.split(' ')[1]}`, 0.7);
                            if (tmpRandom.nickname) {
                                this.playSound('th', `น้อง${tmpRandom.nickname}`, 0.6);
                            }
                            setTimeout(() => { this.onRandomPasscode(); }, 1500);
                        }, 4700);
                    } else {
                        tmpRandom = this.onRandom(this.dataStd);
                        this.result_noDek65 = tmpRandom.no; 
                        this.data_dek.no = tmpRandom.no || '';
                        this.data_dek.fullname = tmpRandom.fullname; // (tmpRandom.firstname + ' ' + tmpRandom.lastname) || '';
                        this.data_dek.nickname = (tmpRandom.nickname != '' ? '\"' + tmpRandom.nickname + '\"' : '') || '';
                        this.data_dek.sec = tmpRandom.sec || '';
                        this.statusStep.dek = true;
                        this.playSound('th', `สุ่มน้องได้ลำดับที่ ${tmpRandom.no}`);
                        this.playSound('th', `${tmpRandom.fullname}`, 0.7);
                        if (tmpRandom.nickname) {
                            this.playSound('th', `น้อง${tmpRandom.nickname}`, 0.6);
                        }
                        this.onRandomPasscode();
                    }
                }, 2000);
            },
            onRandomPasscode() {
                if (this.dataStd.length > 1) {
                    this.clearRandom(
                        setInterval(() => { 
                            this.result_passcode = this.onRandom(this.dataPasscode); 
                        }, 50),
                        setInterval(() => { 
                            this.result_passcode = this.onRandom(this.dataPasscode); 
                        }, 400),
                        setInterval(() => { 
                            this.result_passcode = this.onRandom(this.dataPasscode); 
                        }, 1000)
                    )
                    setTimeout(() => {
                        this.result_passcode = this.onRandom(this.dataPasscode); 
                        this.statusStep.passcode = true;
                        this.pushHistory();
                        setTimeout(() => {
                            this.statusBtnRandom = true;
                        }, 4000);
                    }, 5000);
                } else {
                    this.result_passcode = this.onRandom(this.dataPasscode); 
                    this.statusStep.passcode = true;
                    this.pushHistory();
                    this.fetchHistory();
                    setTimeout(() => {
                        this.statusBtnRandom = true;
                    }, 2000);
                }
            },
            pushHistory() {
                // remove item in list dataStd and dataPasscode
                this.dataStd = this.dataStd.filter(item => item.no != this.data_dek.no);
                this.dataPasscode = this.dataPasscode.filter(item => item != this.result_passcode);

                let tmpVal = {...this.data_dek}
                tmpVal.passcode = this.result_passcode;
                tmpVal.timestamp = new Date().toISOString();
                this.dataHistory.push(tmpVal);

                    // sort by timestamp
                    this.dataHistory.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });

                axios.post(`${base.urlBackend }/dataHistory`, {data: tmpVal})
                    .then(res => {
                        res
                    })
                    .catch(err => {
                        console.log(err);
                    });

                
                setTimeout(() => {
                    let tmpValToSound = '';

                    tmpVal.code = tmpVal.passcode;
                    
                    let tmpRealPasscode = tmpVal.code.replace('*', '').replace('-', ' และ ');
                    this.playSound('th', `สายรหัส ที่ได้คือ ${tmpRealPasscode}`);

                    tmpVal.reason = '';
                    if (tmpVal.code.includes('*')) {
                        tmpVal.reason = 'สายนี้มี Duo #น้องรหัส 2 คน';
                        this.result_reason = 'สายนี้มี Duo น้องรหัส 2 คน';
                        this.playSound('th', 'สายนี้มี ดูโอ้    น้องรหัส 2คน')
                        if (tmpVal.code.includes('-')) {
                            tmpVal.reason += ' และได้พี่รหัส 2 คน (รวมสาย)';
                            tmpValToSound += ' และได้พี่รหัส 2 คน (รวมสาย)'
                            this.result_reason = ' และได้พี่รหัส 2 คน (รวมสาย)';
                            this.playSound('th', 'และได้พี่รหัส 2 คน รวมสาย')
                        }
                        this.statusReason = true;
                    } else if (tmpVal.code.includes('-')) {
                        tmpVal.reason = 'ได้พี่รหัส 2 คน (รวมสาย)';
                        this.result_reason = 'ได้พี่รหัส 2 คน (รวมสาย)';
                        this.playSound('th', 'ได้พี่รหัส 2 คน รวมสาย')
                        this.statusReason = true;
                    }


                    tmpVal.passcode = undefined;
                    tmpVal.timestamp = undefined;
                    delete tmpVal.passcode;
                    delete tmpVal.timestamp;

                    // axios.put(`${base.urlBackend}/dataDek/no/${tmpVal.no}`, {data: tmpVal})
                    //     .then(res => {
                    //         res
                    //     })
                    //     .catch(err => {
                    //         console.log(err);
                    //     });

                    tmpVal.nickname = tmpVal.nickname.replace(/\"/g, '');
                    axios.put(`https://sheetdb.io/api/v1/${base.sheetDBToken}/no/${tmpVal.no}`, {data: tmpVal})
                        .then(async (axiosRes) => {
                            console.log('[SheetDB] Push - Updated!', axiosRes.data);
                        }
                        ).catch((err) => {
                            console.log(err);
                        });

                    setTimeout(() => {
                        this.fetchHistory();
                    }, 100);

                }, 200);

            },
            getTimeReport(date) {
                date = new Date(date)
                return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
            },
            async onDeleteHistory(no) {
                
                axios.delete(`${base.urlBackend}/dataHistory?no=${no}`)
                    .then(async (res) => {
                        // remove item in list dataHistory
                        let tmpValDel = this.dataHistory.find(item => item.no == no);
                        setTimeout(() => {
                            this.dataHistory = this.dataHistory.filter(item => item.no != no);
                        }, 500);

                        tmpValDel.code = '';
                        tmpValDel.reason = '';

                        tmpValDel.nickname = tmpValDel.nickname.replace(/\"/g, '');
                        axios.put(`https://sheetdb.io/api/v1/${base.sheetDBToken}/no/${no}`, {data: tmpValDel})
                            .then(async (axiosRes) => {
                                console.log('[SheetDB] Delete -> Updated!', axiosRes.data);
                            }
                            ).catch((err) => {
                                console.log(err);
                            });
                        await this.fetchDataDek();
                        await this.fetchPasscode();

                    })
                    .catch(err => {
                        console.log(err);
                    });

                // find item in list dataStd by noDek65

                this.result_noDek65 = '🙋‍♂️🙋‍♀️'
                this.result_passcode = '🤷‍♂️🤷‍♀️'
                this.statusStep.dek = false;
                this.statusStep.passcode = false;

            },
            async fetchHistory() {
                await axios.get(`${base.urlBackend}/dataHistory`)
                    .then(res => {
                        console.log('Data history, ', res.data.val);
                        this.dataHistory = res.data.val;
                    })
                    .catch(err => {
                        console.log(err);
                    });

                this.dataHistory = this.dataHistory.sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });
            },
            async fetchDataDek() {
                await axios.get(`${base.urlBackend}/dataDek`)
                    .then(res => {
                        console.log('Data Dek, ', res.data.val);
                        this.dataStd = res.data.val;
                        this.dataHistory.forEach(item => {
                            this.dataStd = this.dataStd.filter(item2 => item2.no != item.no);
                        });
                        this.totalDek = res.data.val.length;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            async fetchPasscode() {
                await axios.get(`${base.urlBackend}/dataPasscode`)
                    .then(res => {
                        this.dataHistory.forEach(item => {
                            this.dataPasscode = this.dataPasscode.filter(item2 => item2 != item.passcode);
                        });
                        this.dataPasscode = res.data.val;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            async fetchData() {
                await this.fetchHistory();
                await this.fetchDataDek();
                await this.fetchPasscode();
            }
        },
        async created() {
            await this.fetchData();
            document.title = 'กิจกรรมจับสายรหัส';
        },
    }
</script>

<template>
    <div  
        :class="{
            'mt-24': data_dek.no === '' && dataHistory.length === 0,
            'mt-6': dataHistory.length !== 0,
            'grid-rows-[80px_320px_1fr]': dataStd.length !== 0,
            'grid-rows-[60px_1fr]': dataStd.length === 0,
        }" 
        class="container_random"
    >

        <div id="playSoundRandom" class="hidden" @click="playFileSound('http://localhost:4000/random_500.mp3')">
            testtt1
        </div>



        <div class="col-span-2 w-10/12 title font_prompt">
            <p>กิจกรรมจับสายรหัส IT {{ new Date().getFullYear() + 543 }}&nbsp;&nbsp;<span :class="{'hidden': data_dek.no !== ''}" class="text-lg relative"><span class="text-4xl absolute -right-16 -top-2">🐒</span> อูก๊า ๆๆๆๆๆ</span></p>
        </div>

        <div class="flex flex-col w-full items-end" :class="{'hidden': dataStd.length === 0}">
            
            <div class="w-10/12 topCardDek65">
                <p class="relative">STEP 1 : สุ่มลำดับน้อง&nbsp;&nbsp;
                    <span class="absolute text-4xl -top-1.5">🙈</span>
                </p>
            </div>
            <div class="w-10/12 middleCardDek65">
                {{ result_noDek65 }}
            </div>
        </div>

        <div class="flex flex-col w-full items-start" :class="{'hidden': dataStd.length === 0}">
            
            <div class="w-10/12 topCardPasscode">
                <p class="relative">STEP 2 : สุ่มสายรหัส&nbsp;&nbsp;
                    <span class="absolute text-4xl -top-1.5">🙉</span>
                </p>
            </div>
            <div class="w-10/12 middleCardPasscode">
                {{ result_passcode }}
            </div>
        </div>

        <div 
            @click="onRandomDek()" 
            class="w-10/12"
            :class="{
                'hidden': dataStd.length === 0,
                'btnStartRandom-active': statusBtnRandom,
                'btnStartRandom-disabled': !statusBtnRandom
            }"
        >
            {{ statusBtnRandom ? 'Start random' : 'Processing...' }}
        </div>


        <div class="mt-6 row-span-2 col-span-2 w-10/12 mx-auto">
            <div
                :class="{'hidden': !statusStep.dek}"  
                class="cardResult hover:bg-sky-100 cursor-crosshair"
            >
                <p :class="{'hidden': !statusStep.passcode }">
                    🎉&nbsp;&nbsp;ได้สายรหัส&nbsp;&nbsp;[&nbsp;&nbsp;{{ result_passcode }}&nbsp;&nbsp;]
                    <span :class="{'hidden': !statusReason}">&nbsp;&nbsp;{{ result_reason }}</span>
                </p>
                <p>✨&nbsp;&nbsp;ลำดับที่&nbsp;&nbsp;{{ data_dek.no }}&nbsp;&nbsp;&nbsp;&nbsp;{{ data_dek.fullname }}{{ data_dek.nickname && '&nbsp;&nbsp;&nbsp;&nbsp;' }}{{ data_dek.nickname }}&nbsp;&nbsp;&nbsp;&nbsp;sec&nbsp;{{ data_dek.sec }}&nbsp;&nbsp;&nbsp;✨</p>
            </div>

            <div
                v-if="dataHistory.length > 0"
                class="mt-6 p-5 flex flex-col gap-y-4 rounded-xl border-2 border-black/40 shadow-md bg-white"
            >
                <div class="flex justify-between">
                    <p>📃&nbsp;ประวัติการสุ่มสายรหัส</p>
                    <p class="mr-10 text-xs mt-1">เหลืออูก๊า ๆ อีก &nbsp;{{ totalDek - dataHistory.length }}</p>
                    <p class="mr-20">🐒&nbsp;{{ dataHistory.length }}/{{ totalDek }}</p>
                </div>

                <div class="grid grid-cols-[120px_2fr_1fr_1fr_1fr_1fr_40px] mt-2">
                    <p class="underline-header-history text-center">No</p>
                    <p class="underline-header-history">Fullname</p>
                    <p class="underline-header-history text-center text-blue-900">Nickname</p>
                    <p class="underline-header-history text-center text-blue-900">Sec</p>
                    <p class="underline-header-history text-center text-red-800">Code</p>
                    <p class="underline-header-history text-center">Timestamp</p>
                    <p class="underline-header-history text-center">#</p>
                </div>
                <div 
                    v-for="(item, index) in dataHistory" :key="index" 
                    class="grid grid-cols-[120px_2fr_1fr_1fr_1fr_1fr_40px]"
                >
                    <p class="text-center">{{ item.no }}</p>
                    <p>{{ item.fullname }}</p>
                    <p class="text-center text-blue-900">{{ item.nickname ? item.nickname.replaceAll('"', '') : '-'}}</p>
                    <p class="text-center text-blue-900">{{ item.sec }}</p>
                    <p class="text-center text-red-800">{{ item.passcode }}</p>
                    <p class="text-center font_roboto text-sm tracking-wider">{{ getTimeReport(item.timestamp) }}</p>
                    <p @click="onDeleteHistory(item.no)" class="text-center w-full h-full flex justify-center items-center cursor-pointer">
                        <img class="h-3 -mt-1" src="./assets/img/trash-can-solid.svg" alt="delete">
                    </p>
                </div>
            </div>
        </div>

        <div
            class="
                text-xs fixed bottom-2 right-0 transform shadow-md
                -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-2 rounded-lg
            "
        >
            {{ totalDek - dataHistory.length }} 🐵 : 🍌 {{ dataPasscode.length }}
        </div>

<div
            class="
                text- fixed top-80 left-20 transform shadow-md
                -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-2 rounded-lg
                rotate-90 tracking-widest
            "
        >
            © csnp.ch
        </div>
        <div class="space mb-40"></div>
        <!-- @click.prevent="playSound('http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3')" -->
    </div>
</template>

