class WordDictionary {
    private final List<String> words = new ArrayList<>();

    public WordDictionary() {}

    public void addWord(String word) { words.add(word); }

    public boolean search(String p) {
        for (String w : words) {
            if (w.length() != p.length()) continue;
            boolean ok = true;
            for (int i = 0; i < p.length() && ok; i++)
                if (p.charAt(i) != '.' && p.charAt(i) != w.charAt(i)) ok = false;
            if (ok) return true;
        }
        return false;
    }
}
