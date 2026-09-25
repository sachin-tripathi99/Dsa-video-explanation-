class Solution {
    private String best = "";

    public String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        permute(s, 0);
        return best.charAt(0) == '0' ? "0" : best;
    }

    private void permute(String[] s, int k) {
        if (k == s.length) {
            String joined = String.join("", s);
            if (joined.compareTo(best) > 0) best = joined;   // same length → string compare
            return;
        }
        for (int i = k; i < s.length; i++) {
            String t = s[k]; s[k] = s[i]; s[i] = t;
            permute(s, k + 1);
            t = s[k]; s[k] = s[i]; s[i] = t;
        }
    }
}
