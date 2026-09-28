class Solution {
    private static class Node { Node[] next = new Node[26]; String word; }
    private final List<String> res = new ArrayList<>();

    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char ch : w.toCharArray()) {
                if (cur.next[ch - 'a'] == null) cur.next[ch - 'a'] = new Node();
                cur = cur.next[ch - 'a'];
            }
            cur.word = w;
        }
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++) dfs(board, r, c, root);
        return res;
    }

    private void dfs(char[][] b, int r, int c, Node parent) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] == '#') return;
        Node node = parent.next[b[r][c] - 'a'];
        if (node == null) return;                           // not a prefix of any word → prune
        if (node.word != null) { res.add(node.word); node.word = null; }   // report once
        char ch = b[r][c];
        b[r][c] = '#';
        dfs(b, r + 1, c, node); dfs(b, r - 1, c, node); dfs(b, r, c + 1, node); dfs(b, r, c - 1, node);
        b[r][c] = ch;
    }
}
