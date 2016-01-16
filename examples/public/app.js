$(function(){
    var isRecording = false;
    var stt;
    var $output = $('#output');

    $('#start-stop').click(function() {

        console.log('test');
        if(isRecording) {
            stt.stop();
            isRecording = false;
        } else {
            isRecording = true;
            $output.html('');

            $.get('/token').then(function(token) {
                stt = new WatsonSpeechToText({token: token});

                // each sentence gets it's own <span> because watson will sometimes go back and change a word as it hears the more of the sentence
                var $curSentence = $('<span/>').appendTo($output);

                stt.on('results', function(data) {
                    // there are always exactly one results object
                    if (data.results[0] && data.results[0].alternatives) {
                        // update the text for the current sentence with the default alternative.
                        // there may be multiple alternatives but this example app ignores all but the first.
                        $curSentence.html(data.results[0].alternatives[0].transcript);
                        if (data.results[0].final) {
                            // if we have the final text for that sentence, start a new one
                            $curSentence = $('<span/>').appendTo($output);
                        }
                    }
                });

                stt.on('error', function(err) {
                    console.log(err);
                });

                stt.start();
            });

        }
    });
});


