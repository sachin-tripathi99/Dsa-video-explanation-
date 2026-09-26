class Solution {
    public int firstMissingPositive(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) seen.add(x);
        int x = 1;
        while (seen.contains(x)) x++;
        return x;
    }
}
