class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;   // remember the rest
            cur.next = prev;            // flip
            prev = cur;
            cur = next;
        }
        return prev;
    }
}
