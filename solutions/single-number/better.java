class Solution {
    public int singleNumber(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) if (!seen.remove(x)) seen.add(x);   // pairs cancel
        return seen.iterator().next();
    }
}
