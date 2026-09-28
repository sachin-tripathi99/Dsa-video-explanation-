class Solution {
    private static class Node { Node[] next = new Node[26]; List<String> top = new ArrayList<>(); }

    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        Node root = new Node();
        for (String s : products) {                         // sorted order → first 3 are smallest
            Node cur = root;
            for (char ch : s.toCharArray()) {
                if (cur.next[ch - 'a'] == null) cur.next[ch - 'a'] = new Node();
                cur = cur.next[ch - 'a'];
                if (cur.top.size() < 3) cur.top.add(s);
            }
        }
        List<List<String>> res = new ArrayList<>();
        Node cur = root;
        for (char ch : searchWord.toCharArray()) {
            cur = cur == null ? null : cur.next[ch - 'a'];  // one step per keystroke
            res.add(cur == null ? new ArrayList<>() : cur.top);
        }
        return res;
    }
}
