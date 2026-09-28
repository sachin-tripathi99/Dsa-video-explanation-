class Solution {
    private static class Node { Node[] next = new Node[26]; String word; }
    private String best = "";

    public String longestWord(String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char ch : w.toCharArray()) {
                if (cur.next[ch - 'a'] == null) cur.next[ch - 'a'] = new Node();
                cur = cur.next[ch - 'a'];
            }
            cur.word = w;
        }
        dfs(root);
        return best;
    }

    private void dfs(Node node) {
        for (Node kid : node.next) {                        // letter order → ties resolved
            if (kid == null || kid.word == null) continue;  // only through word ends
            if (kid.word.length() > best.length()) best = kid.word;
            dfs(kid);
        }
    }
}
