class Solution {
    private Boolean[] memo;

    public boolean wordBreak(String s, List<String> wordDict) {
        memo = new Boolean[s.length()];
        return can(s, 0, new HashSet<>(wordDict));
    }

    private boolean can(String s, int start, Set<String> dict) {
        if (start == s.length()) return true;
        if (memo[start] != null) return memo[start];        // this suffix solved before
        for (int end = start + 1; end <= s.length(); end++)
            if (dict.contains(s.substring(start, end)) && can(s, end, dict)) return memo[start] = true;
        return memo[start] = false;
    }
}
