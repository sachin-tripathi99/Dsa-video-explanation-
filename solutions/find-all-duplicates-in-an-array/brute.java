class Solution {
    public List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> out = new ArrayList<>();
        for (int x : nums) if (!seen.add(x)) out.add(x);
        return out;
    }
}
