class Solution {
    private final List<List<String>> out = new ArrayList<>();

    public List<List<String>> partition(String s) {
        go(s, 0, new ArrayList<>());
        return out;
    }

    private void go(String s, int i, List<String> path) {
        if (i == s.length()) { out.add(new ArrayList<>(path)); return; }
        for (int j = i + 1; j <= s.length(); j++) {
            String piece = s.substring(i, j);
            if (!new StringBuilder(piece).reverse().toString().equals(piece)) continue;   // O(n) check
            path.add(piece);
            go(s, j, path);
            path.remove(path.size() - 1);
        }
    }
}
