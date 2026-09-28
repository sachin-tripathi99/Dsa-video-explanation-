class Solution {
    private static class Node { Node[] next = new Node[26]; boolean end; }

    public String replaceWords(List<String> dictionary, String sentence) {
        Node root = new Node();
        for (String d : dictionary) {
            Node cur = root;
            for (char ch : d.toCharArray()) {
                if (cur.next[ch - 'a'] == null) cur.next[ch - 'a'] = new Node();
                cur = cur.next[ch - 'a'];
            }
            cur.end = true;
        }
        StringBuilder sb = new StringBuilder();
        for (String w : sentence.split(" ")) {
            if (sb.length() > 0) sb.append(' ');
            Node cur = root;
            int i = 0;
            while (i < w.length() && cur.next[w.charAt(i) - 'a'] != null && !cur.end) cur = cur.next[w.charAt(i++) - 'a'];
            sb.append(cur.end ? w.substring(0, i) : w);     // first ✓ on the walk
        }
        return sb.toString();
    }
}
