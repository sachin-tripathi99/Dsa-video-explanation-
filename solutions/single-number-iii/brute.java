class Solution {
    public int[] singleNumber(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        int[] res = new int[2];
        int k = 0;
        for (var e : count.entrySet()) if (e.getValue() == 1) res[k++] = e.getKey();
        return res;
    }
}
