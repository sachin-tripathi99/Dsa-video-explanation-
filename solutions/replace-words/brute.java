class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        Set<String> roots = new HashSet<>(dictionary);
        String[] words = sentence.split(" ");
        for (int k = 0; k < words.length; k++)
            for (int i = 1; i <= words[k].length(); i++)    // shortest prefix first
                if (roots.contains(words[k].substring(0, i))) { words[k] = words[k].substring(0, i); break; }
        return String.join(" ", words);
    }
}
