class WordDictionary {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd;
    }

    private final Node root = new Node();

    public WordDictionary() {}

    public void addWord(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) node.children[i] = new Node();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        return dfs(root, word, 0);
    }

    private boolean dfs(Node node, String p, int i) {
        if (i == p.length()) return node.isEnd;
        char ch = p.charAt(i);
        if (ch == '.') {
            for (Node child : node.children)
                if (child != null && dfs(child, p, i + 1)) return true;   // try every branch
            return false;
        }
        Node child = node.children[ch - 'a'];
        return child != null && dfs(child, p, i + 1);
    }
}
