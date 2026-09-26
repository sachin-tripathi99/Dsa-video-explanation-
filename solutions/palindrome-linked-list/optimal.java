class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode prev = null;                              // reverse the second half
        while (slow != null) {
            ListNode nx = slow.next;
            slow.next = prev;
            prev = slow;
            slow = nx;
        }
        for (ListNode a = head, b = prev; b != null; a = a.next, b = b.next)
            if (a.val != b.val) return false;
        return true;
    }
}
