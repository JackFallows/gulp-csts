namespace MyNamespace
{
    public class Contact : Person
    {
        public string FirstName { get; set; }
    
        public Thing LastName { get; set; }

        public int? Age { get; set; }

        public bool IsActive { get; set; }
    }
}