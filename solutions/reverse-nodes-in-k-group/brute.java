class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        List<ListNode> group = new ArrayList<>();
        ListNode p = head;
        while (p != null) {
            group.clear();
            ListNode q = p;
            while (q != null && group.size() < k) { group.add(q); q = q.next; }
            if (group.size() < k) break;
            for (int i = 0, j = k - 1; i < j; i++, j--) {          // swap values
                int t = group.get(i).val; group.get(i).val = group.get(j).val; group.get(j).val = t;
            }
            p = q;
        }
        return head;
    }
}
