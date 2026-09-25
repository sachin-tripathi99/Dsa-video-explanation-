class Trie {
    private final Set<String> words = new HashSet<>();
    private final Set<String> prefixes = new HashSet<>();

    public Trie() {}

    public void insert(String word) {
        words.add(word);
        for (int i = 1; i <= word.length(); i++) prefixes.add(word.substring(0, i));   // O(L²)
    }

    public boolean search(String word) { return words.contains(word); }

    public boolean startsWith(String prefix) { return prefixes.contains(prefix); }
}
