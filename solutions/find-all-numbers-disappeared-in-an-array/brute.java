class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) seen.add(x);
        List<Integer> out = new ArrayList<>();
        for (int x = 1; x <= nums.length; x++) if (!seen.contains(x)) out.add(x);
        return out;
    }
}
