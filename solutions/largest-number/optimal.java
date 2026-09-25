class Solution {
    public String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));   // a first if a+b > b+a
        if (s[0].equals("0")) return "0";                     // all zeros
        return String.join("", s);
    }
}
