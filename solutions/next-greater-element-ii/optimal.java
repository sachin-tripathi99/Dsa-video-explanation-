class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < 2 * n; i++) {                   // two laps
            int x = nums[i % n];
            while (!st.isEmpty() && nums[st.peek()] < x) ans[st.pop()] = x;
            if (i < n) st.push(i);                          // only the first lap waits
        }
        return ans;
    }
}
