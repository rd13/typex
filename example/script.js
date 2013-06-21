function crypt() {
    var pos = document.getElementById('pos').value;
    var ori = document.getElementById('ori').value;
    var rot = document.getElementById('rot').value;
    var str = document.getElementById('source_text').value;

    document.getElementById('destination_text').value = TypeX.init(pos,ori,rot,str);
}