class Solution {
    private int[] memo;

    public int numDecodings(String s) {
        memo = new int[s.length()];
        Arrays.fill(memo, -1);
        return count(s, 0);
    }

    private int count(String s, int i) {
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;
        if (memo[i] >= 0) return memo[i];                   // this suffix solved before
        int ways = count(s, i + 1);
        if (i + 1 < s.length() && Integer.parseInt(s.substring(i, i + 2)) <= 26) ways += count(s, i + 2);
        return memo[i] = ways;
    }
}
