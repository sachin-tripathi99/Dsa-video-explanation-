class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;     // gap of n + 1
        while (fast != null) { slow = slow.next; fast = fast.next; }
        slow.next = slow.next.next;                         // unlink the n-th from the end
        return dummy.next;
    }
}
