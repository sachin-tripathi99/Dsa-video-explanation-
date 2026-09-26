class Solution {
    public int missingNumber(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) seen.add(x);
        for (int x = 0; ; x++) if (!seen.contains(x)) return x;
    }
}
