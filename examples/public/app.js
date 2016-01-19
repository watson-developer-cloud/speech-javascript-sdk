$(function(){
    var running = false;
    var stt;


    // mic input
    var $output = $('#output');
    $('#start-stop').click(function() {

        console.log('test');
        if(running) {
            stt.stop();
            running = false;
        } else {
            running = true;
            $output.html('');

            $.get('/token').then(function(token) {
                stt = new WatsonSpeechToText({
                    continuous: false, // automatically stop the first time a pause is detected
                    token: token
                });

                // each sentence gets it's own <span> because watson will sometimes go back and change a word as it hears the more of the sentence
                var $curSentence = $('<span/>').appendTo($output);

                stt.on('results', function(data) {
                    // currently there are always either zero or one results objects
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

                stt.on('connection-close', function(code) {
                    console.log('websocket closed with status code ', code);
                    running = false;
                });

                stt.start();
            });

        }
    });


    // file input
    var $fileOutput = $('#file-output');
    $('#start-stop-file').click(function() {

        console.log('test');
        if(running) {
            stt.stop();
            running = false;
        } else {
            running = true;
            $fileOutput.html('');

            console.log('starting file upload')
            $.get('/token').then(function(token) {
                stt = new WatsonSpeechToText({
                    token: token,
                    file: $('#audiofile')[0].files[0],
                    play: true
                });

                // each sentence gets it's own <span> because watson will sometimes go back and change a word as it hears the more of the sentence
                var $curSentence = $('<span/>').appendTo($fileOutput);

                stt.on('results', function(data) {
                    // currently there are always either zero or one results objects
                    if (data.results[0] && data.results[0].alternatives) {
                        // update the text for the current sentence with the default alternative.
                        // there may be multiple alternatives but this example app ignores all but the first.
                        $curSentence.html(data.results[0].alternatives[0].transcript);
                        if (data.results[0].final) {
                            // if we have the final text for that sentence, start a new one
                            $curSentence = $('<span/>').appendTo($fileOutput);
                        }
                    }
                });

                stt.on('error', function(err) {
                    console.log(err);
                });

                stt.on('connection-close', function(code) {
                    console.log('websocket closed with status code ', code);
                    running = false;
                });

                stt.start();
            });

        }
    });
});


