class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int l = 0, r = arr.length - 1;
        while (r - l + 1 > k) {
            if (x - arr[l] > arr[r] - x) l++;               // left end is farther
            else r--;
        }
        List<Integer> out = new ArrayList<>();
        for (int i = l; i <= r; i++) out.add(arr[i]);
        return out;
    }
}
