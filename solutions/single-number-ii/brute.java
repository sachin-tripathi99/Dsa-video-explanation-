class Solution {
    public int singleNumber(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        for (var e : count.entrySet()) if (e.getValue() == 1) return e.getKey();
        return -1;
    }
}
