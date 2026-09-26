class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;                             // fewer than k left
            ListNode after = kth.next, first = groupPrev.next;
            ListNode prev = after, cur = first;
            while (cur != after) {                              // reverse the group
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            groupPrev.next = kth;                               // kth is the new front
            groupPrev = first;                                  // old front is now the back
        }
        return dummy.next;
    }
}
