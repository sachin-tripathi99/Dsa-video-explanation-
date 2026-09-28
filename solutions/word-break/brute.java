class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        return can(s, 0, new HashSet<>(wordDict));
    }

    private boolean can(String s, int start, Set<String> dict) {
        if (start == s.length()) return true;
        for (int end = start + 1; end <= s.length(); end++)  // try every first word
            if (dict.contains(s.substring(start, end)) && can(s, end, dict)) return true;
        return false;
    }
}
